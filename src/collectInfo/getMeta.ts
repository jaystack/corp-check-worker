import { Meta, PackageMeta } from '../types';
import getCache from '../lambda/getCache';
import getNpmScores from './getNpmScores';
/* import getNpmData from './getNpmData';
import getDownloads from './getDownloads';
import getDependents from './getDependents';
import getRepositories from './getRepositories';
import getGithubData from './getGithubData'; */

export default async (packageList: string[]): Promise<Meta> => {
  const cache = await getCache(packageList);
  const uncachedPackages = packageList.filter(name => !(name in cache));
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

/* export default async (packageList: string[]): Promise<Meta> => {
  const cache = await getCache(packageList);
  const uncachedPackages = packageList.filter(name => !(name in cache));
  const npmData = await getNpmData(uncachedPackages);
  const downloads = await getDownloads(uncachedPackages);
  const dependents = await getDependents(uncachedPackages);
  const repositories = getRepositories(npmData);
  const githubData = await getGithubData(repositories);
  return uncachedPackages.reduce(
    (meta, name) => ({
      ...meta,
      [name]: {
        ...npmData[name],
        ...githubData[name],
        downloadFrequency: downloads[name],
        dependendtsCount: dependents[name]
      } as PackageMeta
    }),
    cache
  );
};
 */
