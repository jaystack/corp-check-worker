import request = require('request-promise-native');
import { NpmData } from '../types';

export default async (packageList: string[]): Promise<NpmData[]> => {
  const { rows } = await request.post('https://replicate.npmjs.com/registry/_all_docs?include_docs=true', {
    json: true,
    body: { keys: packageList }
  });
  return rows.map(
    ({ doc: { 'dist-tags': distTags = null, maintainers = null, time = null, repository = null } = {} }) =>
      ({
        distTags: Object.keys(distTags).map(tag => ({ version: distTags[tag], tag })),
        maintainersCount: maintainers ? maintainers.length : null,
        releases: time
          ? Object.keys(time)
              .filter(key => key !== 'modified' && key !== 'created')
              .map(key => ({ time: Date.parse(time[key]), value: key }))
              .sort((a, b) => a.time - b.time)
          : null,
        repository
      } as NpmData)
  );
};
