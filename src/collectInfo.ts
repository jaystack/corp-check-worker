import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';
import getLicenseInfo = require('get-license-npm');
import request = require('request-promise-native');
import { packageName as packageNamePattern, scope as scopePattern } from './patterns';

export type License = {
  license: string;
  licenseFile: boolean;
  private: boolean;
};

export type Package = {
  name: string;
  version: string;
  license: License;
  dependencies: Package[];
};

export type Info = {
  tree: Package;
  stats: any;
};

const getSubFolders = (predicate: (file: string) => boolean) => (files: string[]): string[] => files.filter(predicate);
const getRegularFolders = getSubFolders(file => packageNamePattern.test(file));
const getScopedFolders = getSubFolders(file => scopePattern.test(file));

const flatArray = <T>(array: T[][]) => array.reduce((acc, arr) => [ ...acc, ...arr ], []);

const getDependencies = async (entryPoint: string): Promise<Package[]> => {
  if (!await pathExists(entryPoint)) return [];
  const files = await readdir(entryPoint);
  const regularFolders = getRegularFolders(files);
  const scopedFolders = getScopedFolders(files);
  const regularDependencies = await Promise.all(regularFolders.map(folder => getTree(join(entryPoint, folder))));
  const scopes = await Promise.all(scopedFolders.map(folder => getDependencies(join(entryPoint, folder))));
  const scopedDependencies = flatArray(scopes);
  return [ ...regularDependencies, ...scopedDependencies ];
};

const getTree = async (entryPoint: string): Promise<Package> => {
  const { name, version } = await readJson(join(entryPoint, 'package.json'));
  const license = await getLicenseInfo(entryPoint);
  return {
    name,
    version,
    license: { license: license.license || null, licenseFile: !!license.licenseFile, private: !!license.private },
    dependencies: await getDependencies(join(entryPoint, 'node_modules'))
  };
};

const getPackageList = (pkg: Package, set: Set<string> = new Set<string>()): string[] => {
  set.add(pkg.name);
  pkg.dependencies.forEach(p => getPackageList(p, set));
  return [ ...set ];
};

const getStats = async (pkg: Package) => {
  const packageList = getPackageList(pkg);
  const stats = await request({
    method: 'POST',
    uri: 'https://api.npms.io/v2/package/mget',
    json: true,
    body: packageList
  });
  Object.values(stats).forEach(({ collected }) => {
    delete collected.metadata.maintainers;
    delete collected.metadata.readme;
    delete collected.github.contributors;
  });
  return stats;
};

export default async (entryPoint: string): Promise<Info> => {
  const tree = await getTree(entryPoint);
  //const stats = await getStats(tree);
  return { tree, stats: {} };
};
