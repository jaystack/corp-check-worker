import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';
import getLicenseInfo = require('get-license-npm');
import { Node, flatten } from 'corp-check-core';
import { packageName as packageNamePattern, scope as scopePattern } from '../consts';

const getSubFolders = (predicate: (file: string) => boolean) => (files: string[]): string[] => files.filter(predicate);
const getRegularFolders = getSubFolders(file => packageNamePattern.test(file));
const getScopedFolders = getSubFolders(file => scopePattern.test(file));

const getDependencies = async (entryPoint: string): Promise<Node[]> => {
  if (!await pathExists(entryPoint)) return [];
  const files = await readdir(entryPoint);
  const regularFolders = getRegularFolders(files);
  const scopedFolders = getScopedFolders(files);
  const regularDependencies = await Promise.all(regularFolders.map(folder => getTree(join(entryPoint, folder))));
  const scopes = await Promise.all(scopedFolders.map(folder => getDependencies(join(entryPoint, folder))));
  const scopedDependencies = flatten(scopes);
  return [ ...regularDependencies, ...scopedDependencies ];
};

const getTree = async (entryPoint: string): Promise<Node> => {
  const { name, version } = await readJson(join(entryPoint, 'package.json'));
  const license = await getLicenseInfo(entryPoint);
  const licenseValue = license.license || null;
  const licenseType = (licenseValue && licenseValue.type) || licenseValue;

  return {
    name,
    version,
    license: { type: licenseType, hasLicenseFile: !!license.licenseFile, isPrivate: !!license.private },
    dependencies: await getDependencies(join(entryPoint, 'node_modules'))
  };
};

export default getTree;
