import { Info } from '../types';
import getPackageList from './getPackageList';
import getTree from './getTree';
import getMeta from './getMeta';

export default async (entryPoint: string): Promise<Info> => {
  console.log('DISCOVER FILE SYSTEM FROM:', entryPoint);
  const tree = await getTree(entryPoint);
  console.log('TREE:', tree);
  const packageList = getPackageList(tree);
  console.log('PACKAGE LIST:', packageList);
  const meta = await getMeta(packageList);
  console.log('META:', meta);
  return { tree, meta };
};
