import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';
import { Node, flatten } from 'corp-check-core';
import { JOB_FOLDER } from '../consts';
import resolveLicense from '../side-effects/resolveLicense';
import { filterRegularFolders, filterScopedFolders } from '../utils/filterFolders';

const getPathFromEntryPoint = (entryPoint: string): string => {
  const [ , path ] = new RegExp(`${JOB_FOLDER}\/(.+)`).exec(entryPoint) || [ , '' ];
  return path.split(/\\|\//g).filter(p => p !== 'node_modules').join('/');
};

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
  try {
    const { name, version } = await readJson(join(entryPoint, 'package.json'));
    return {
      name,
      version,
      license: await resolveLicense(entryPoint),
      dependencies: await getDependencies(join(entryPoint, 'node_modules'))
    };
  } catch (error) {
    if (error.msg) throw error;
    error.msg = `Error in ${getPathFromEntryPoint(entryPoint)}`;
    throw error;
  }
};

export default getTree;
