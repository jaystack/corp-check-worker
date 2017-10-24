import { ensureDir, writeJSON } from 'fs-extra';
import { join } from 'path';
import exec, { ExecOptions } from '../side-effects/exec';
import { Registry } from '../types';

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

export const installByName = (pkg: string, folder: string, { exec: execOptions = {} }: { exec?: ExecOptions }) =>
  exec(`npm install --no-save --legacy-bundling --prefix ${folder} ${pkg}`, { ...execOptions });

export const installByJson = async (
  json: any,
  folder: string,
  {
    exec: execOptions = {},
    packageLock,
    production,
    unknownPackages
  }: { exec?: ExecOptions; packageLock?: any; production: boolean; unknownPackages: string[] }
) => {
  const filteredJson = cleanJsonByUnknownPackages(json, unknownPackages);
  await ensureDir(folder);
  await writeJSON(join(folder, 'package.json'), filteredJson);
  if (packageLock) await writeJSON(join(folder, 'package-lock.json'), packageLock);
  return await exec(`npm install --legacy-bundling${production ? ' --production' : ''}`, {
    ...execOptions,
    cwd: folder
  });
};
