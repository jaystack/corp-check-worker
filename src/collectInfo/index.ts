import request = require('request-promise-native');
import { Info, Package, Meta } from '../types';
import getTree from './getTree';
import getMeta from './getMeta';

const getPackageList = (pkg: Package, set: Set<string> = new Set<string>()): string[] => {
  if (pkg.name) set.add(pkg.name);
  pkg.dependencies.forEach(p => getPackageList(p, set));
  return [ ...set ];
};

export default async (entryPoint: string): Promise<Info> => {
  console.log('collect info...');

  console.log('\tcollect info from file system...');
  const tree = await getTree(entryPoint);
  console.log('\tdone');

  const packageList = getPackageList(tree);
  
  console.log('\tget meta data');
  const meta = await getMeta(packageList);
  console.log('\tdone');

  console.log('done');

  return { tree, meta };
};
