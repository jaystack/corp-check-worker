import { Info } from 'corp-check-core';
import getPackageList from './getPackageList';
import getTree from './getTree';
import getMeta from './getMeta';

export default async (entryPoint: string, unknownPackages: string[]): Promise<Info> => {
  console.log('DISCOVER FILE SYSTEM FROM:', entryPoint);
  console.log('GET TREE');
  const tree = await getTree(entryPoint);
  const packageList = getPackageList(tree);
  console.log('GET META');
  const meta = await getMeta(packageList);
  return { tree, meta, unknownPackages };
};
