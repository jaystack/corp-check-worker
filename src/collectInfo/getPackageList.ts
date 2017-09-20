import { Package } from '../types';

const getPackageList = (pkg: Package, set: Set<string> = new Set<string>()): string[] => {
  if (pkg.name) set.add(pkg.name);
  pkg.dependencies.forEach(p => getPackageList(p, set));
  return [ ...set ];
};

export default getPackageList;
