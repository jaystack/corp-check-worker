import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';
import getLicenseInfo = require('get-license-npm');
import request = require('request-promise-native');
import { packageName as packageNamePattern, scope as scopePattern } from './patterns';
import { Info, Package, Meta } from './types';

const getSubFolders = (predicate: (file: string) => boolean) => (files: string[]): string[] => files.filter(predicate);
const getRegularFolders = getSubFolders(file => packageNamePattern.test(file));
const getScopedFolders = getSubFolders(file => scopePattern.test(file));

const flatArray = <T>(array: T[][]) => array.reduce((prev, next) => [ ...prev, ...next ], []);

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
    license: { type: license.license || null, hasLicenseFile: !!license.licenseFile, isPrivate: !!license.private },
    dependencies: await getDependencies(join(entryPoint, 'node_modules'))
  };
};

const getPackageList = (pkg: Package, set: Set<string> = new Set<string>()): string[] => {
  set.add(pkg.name);
  pkg.dependencies.forEach(p => getPackageList(p, set));
  return [ ...set ];
};

const getMeta = async (pkg: Package): Promise<Meta> => {
  if (!pkg.name) return {};
  const packageList = getPackageList(pkg);
  return packageList.reduce((meta, name) => ({ ...meta, [name]: {} }), {});
  /* try {
    const stats = await request({
      method: 'POST',
      uri: 'https://api.npms.io/v2/package/mget',
      json: true,
      body: packageList,
      timeout: 5000
    });
    Object.values(stats).forEach(({ collected: { metadata, github } }) => {
      if (metadata) delete metadata.maintainers;
      if (metadata) delete metadata.readme;
      if (github) delete github.contributors;
    });
    return stats;
  } catch (error) {
    console.error(error);
    return {};
  } */
};

export default async (entryPoint: string): Promise<Info> => {
  console.log('collect info...');

  console.log('\tcollect info from file system...');
  const tree = await getTree(entryPoint);
  console.log('\tdone');

  console.log('\tget meta data');
  const meta = await getMeta(tree);
  console.log('\tdone');

  console.log('done');

  return { tree, meta };
};
