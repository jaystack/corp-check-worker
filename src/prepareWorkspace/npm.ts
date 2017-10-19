import request = require('request-promise-native');
import { ensureDir, writeJSON } from 'fs-extra';
import { join } from 'path';
import exec, { ExecOptions } from './exec';
import { Registry } from '../types';

const getPackagesAvailability = async (packageNames: string[]): Promise<Registry<boolean>> => {
  const { rows } = await request.post('https://replicate.npmjs.com/registry/_all_docs', {
    json: true,
    body: { keys: packageNames }
  });
  return rows.reduce((acc, { key, error }) => ({ ...acc, [key]: !error }), {});
};

const getUnknownPackageNames = async (json: any, production: boolean): Promise<string[]> => {
  const dependencies = production ? json.dependencies : { ...json.dependencies, ...json.devDependencies };
  const packageNames = Object.keys(dependencies);
  const packageAvailability = await getPackagesAvailability(packageNames);
  return Object.keys(packageAvailability).filter(name => !packageAvailability[name]);
};

const filterDependenciesByUnknownPackages = (
  dependencies: Registry<string> = {},
  unknownPackageNames: string[]
): Registry<string> =>
  Object.keys(dependencies).reduce(
    (acc, name) => (unknownPackageNames.includes(name) ? acc : { ...acc, [name]: dependencies[name] }),
    {}
  );

const cleanJsonByUnknownPackages = (json: any, unknownPackageNames: string[]): any => ({
  ...json,
  dependencies: filterDependenciesByUnknownPackages(json.dependencies, unknownPackageNames),
  devDependencies: filterDependenciesByUnknownPackages(json.devDependencies, unknownPackageNames)
});

const createFoldersForUnknownPackages = (unknownPackageNames: string[], folder: string) =>
  Promise.all(
    unknownPackageNames.map(async name => {
      const packageFolder = join(folder, name);
      await ensureDir(packageFolder);
      await writeJSON(join(packageFolder, 'package.json'), { name, version: null });
    })
  );

export const installByName = (pkg: string, folder: string, { exec: execOptions = {} }: { exec?: ExecOptions }) =>
  exec(`npm install --no-save --legacy-bundling --prefix ${folder} ${pkg}`, { ...execOptions });

export const installByJson = async (
  json: string,
  folder: string,
  { exec: execOptions = {}, packageLock, production }: { exec?: ExecOptions; packageLock: any; production: boolean }
) => {
  const unknownPackageNames = await getUnknownPackageNames(json, production);
  console.log('UNKNOWN PACKAGES:', unknownPackageNames);
  const filteredJson = cleanJsonByUnknownPackages(json, unknownPackageNames);
  await ensureDir(folder);
  await writeJSON(join(folder, 'package.json'), filteredJson);
  if (packageLock) await writeJSON(join(folder, 'package-lock.json'), packageLock);
  const result = await exec(`npm install --legacy-bundling ${production ? '--production' : ''}`, {
    ...execOptions,
    cwd: folder
  });
  await createFoldersForUnknownPackages(unknownPackageNames, join(folder, 'node_modules'));
  return result;
};
