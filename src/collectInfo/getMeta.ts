import { Meta, PackageMeta } from '../types';
import getBulkInfo from './getBulkInfo';
import getDistTags from './getDistTags';
import getMaintainers from './getMaintainers';
import getReleases from './getReleases';
import getDownloads from './getDownloads';

export default async (packageList: string[]): Promise<Meta> => {
  const bulkInfo = await getBulkInfo(packageList);
  const distTags = getDistTags(bulkInfo);
  const maintainers = getMaintainers(bulkInfo);
  const releases = getReleases(bulkInfo);
  const downloads = await getDownloads(packageList);
  return packageList.reduce(
    (meta, name, i) => ({
      ...meta,
      [name]: {
        downloadFrequency: downloads[i],
        distTags: distTags[i],
        numOfMaintainers: maintainers[i],
        releases: releases[i]
      } as PackageMeta
    }),
    {}
  );
};
