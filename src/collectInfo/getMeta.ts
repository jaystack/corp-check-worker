import { Meta, PackageMeta } from '../types';
import getBulkInfo from './getBulkInfo';
import getDownloads from './getDownloads';
import getDependents from './getDependents';
import getGithubUrls from './getGithubUrls';

export default async (packageList: string[]): Promise<Meta> => {
  const bulkInfo = await getBulkInfo(packageList);
  const downloads = await getDownloads(packageList);
  const dependents = await getDependents(packageList);
  const githubUrls = getGithubUrls(bulkInfo);
  //console.log(githubUrls);
  return packageList.reduce(
    (meta, name, i) => ({
      ...meta,
      [name]: {
        ...bulkInfo[i],
        downloadFrequency: downloads[i],
        numOfDependents: dependents[i]
      } as PackageMeta
    }),
    {}
  );
};
