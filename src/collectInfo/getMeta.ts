import { PackageMeta } from 'corp-check-core';
import { getCache } from '../side-effects/lambda';
import getNpmScores from './getNpmScores';

export default async (packageList: string[]): Promise<PackageMeta[]> => {
  console.log('GET CACHE');
  const cache = await getCache(packageList);
  console.log('CACHED PACKAGES:', cache.map(({ name }) => name));
  const uncachedPackages = packageList.filter(name => !cache.find(c => c.name === name));
  console.log('UNCACHED PACKAGES:', uncachedPackages);
  console.log('GET NPM-SCORES');
  const npmScores = await getNpmScores(uncachedPackages);
  return [
    ...cache,
    ...uncachedPackages.map(name => ({
      name,
      npmScores: npmScores[name]
    }))
  ];
};
