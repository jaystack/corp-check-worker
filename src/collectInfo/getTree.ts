import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';
import { Node, flatten } from 'corp-check-core';
import resolveLicense from '../side-effects/resolveLicense';
import { filterRegularFolders, filterScopedFolders } from '../utils/filterFolders';

const getDependencies = async (entryPoint: string): Promise<Node[]> => {
  if (!await pathExists(entryPoint)) return [];
  const files = await readdir(entryPoint);
  const regularFolders = filterRegularFolders(files);
  const scopedFolders = filterScopedFolders(files);
  const regularDependencies = await Promise.all(regularFolders.map(folder => getTree(join(entryPoint, folder))));
  const scopes = await Promise.all(scopedFolders.map(folder => getDependencies(join(entryPoint, folder))));
  const scopedDependencies = flatten(scopes);
  return [ ...regularDependencies, ...scopedDependencies ];
};

const getTree = async (entryPoint: string): Promise<Node> => {
  const { name, version } = await readJson(join(entryPoint, 'package.json'));
  return {
    name,
    version,
    license: await resolveLicense(entryPoint),
    dependencies: await getDependencies(join(entryPoint, 'node_modules'))
  };
};

export default getTree;
