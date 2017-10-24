import { Meta, PackageMeta } from 'corp-check-core';
import { getCache } from '../side-effects/lambda';
import getNpmScores from './getNpmScores';

export default async (packageList: string[]): Promise<Meta> => {
  console.log('GET CACHE');
  const cache = await getCache(packageList);
  console.log('CACHED PACKAGES:', Object.keys(cache));
  const uncachedPackages = packageList.filter(name => !(name in cache));
  console.log('UNCACHED PACKAGES:', uncachedPackages);
  console.log('GET NPM-SCORES');
  const npmScores = await getNpmScores(uncachedPackages);
  return uncachedPackages.reduce(
    (meta, name) => ({
      ...meta,
      [name]: {
        npmScores: npmScores[name]
      } as PackageMeta
    }),
    cache
  );
};
