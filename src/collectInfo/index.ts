import { Info } from '../types';
import getPackageList from './getPackageList';
import getTree from './getTree';
import getMeta from './getMeta';

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
