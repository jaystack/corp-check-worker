import { Meta, PackageMeta } from '../types';
import getBulkInfo from './getBulkInfo';
import getDownloads from './getDownloads';
import getDependents from './getDependents';

export default async (packageList: string[]): Promise<Meta> => {
  const bulkInfo = await getBulkInfo(packageList);
  const downloads = await getDownloads(packageList);
  const dependents = await getDependents(packageList);
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
