import { Info } from '../types';
import getPackageList from './getPackageList';
import getTree from './getTree';
import getMeta from './getMeta';

export default async (entryPoint: string): Promise<Info> => {
  const tree = await getTree(entryPoint);
  const packageList = getPackageList(tree);
  const meta = await getMeta(packageList);
  return { tree, meta };
};
