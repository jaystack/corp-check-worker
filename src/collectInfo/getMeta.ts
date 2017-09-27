import { Meta, PackageMeta } from '../types';
import getNpmData from './getNpmData';
import getDownloads from './getDownloads';
import getDependents from './getDependents';
import getRepositories from './getRepositories';
import getGithubData from './getGithubData';
import {} from '../consts'

export default async (packageList: string[]): Promise<Meta> => {
  const npmData = await getNpmData(packageList);
  const downloads = await getDownloads(packageList);
  const dependents = await getDependents(packageList);
  const repositories = getRepositories(npmData);
  const githubData = await getGithubData(repositories);
  return packageList.reduce(
    (meta, name) => ({
      ...meta,
      [name]: {
        ...npmData[name],
        ...githubData[name],
        downloadFrequency: downloads[name],
        dependendtsCount: dependents[name]
      } as PackageMeta
    }),
    {}
  );
};
