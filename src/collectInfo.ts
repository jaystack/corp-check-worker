import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';
import getLicenseInfo = require('get-license-npm');
import { packageName as packageNamePattern, scope as scopePattern } from './patterns';

export type License = {
  license: string;
  licenseFile: boolean;
  private: boolean;
};

export type Info = {
  name: string;
  version: string;
  license: License;
  dependencies: Info[];
};

const getSubFolders = (predicate: (file: string) => boolean) => (files: string[]): string[] => files.filter(predicate);
const getRegularFolders = getSubFolders(file => packageNamePattern.test(file));
const getScopedFolders = getSubFolders(file => scopePattern.test(file));

const flatArray = <T>(array: T[][]) => array.reduce((acc, arr) => [ ...acc, ...arr ], []);

const getDependencies = async (entryPoint: string): Promise<Info[]> => {
  if (!await pathExists(entryPoint)) return [];
  const files = await readdir(entryPoint);
  const regularFolders = getRegularFolders(files);
  const scopedFolders = getScopedFolders(files);
  const regularDependencies = await Promise.all(regularFolders.map(folder => getInfo(join(entryPoint, folder))));
  const scopes = await Promise.all(scopedFolders.map(folder => getDependencies(join(entryPoint, folder))));
  const scopedDependencies = flatArray(scopes);
  return [ ...regularDependencies, ...scopedDependencies ];
};

const getInfo = async (entryPoint: string): Promise<Info> => {
  const { name, version } = await readJson(join(entryPoint, 'package.json'));
  const license = await getLicenseInfo(entryPoint);
  return {
    name,
    version,
    license: { license: license.license || null, licenseFile: !!license.licenseFile, private: !!license.private },
    dependencies: await getDependencies(join(entryPoint, 'node_modules'))
  };
};

export default getInfo;
