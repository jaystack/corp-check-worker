import { Node } from 'corp-check-core';

const getPackageList = (pkg: Node, set: Set<string> = new Set<string>()): string[] => {
  if (pkg.name) set.add(pkg.name);
  pkg.dependencies.forEach(p => getPackageList(p, set));
  return [ ...set ];
};

export default getPackageList;
