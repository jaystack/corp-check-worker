import request = require('request-promise-native');
import { NpmData, Registry } from '../types';

export default async (packageList: string[]): Promise<Registry<NpmData>> => {
  const { rows } = await request.post('https://replicate.npmjs.com/registry/_all_docs?include_docs=true', {
    json: true,
    body: { keys: packageList }
  });
  return rows.reduce(
    (
      acc,
      { doc: { name = null, 'dist-tags': distTags = null, maintainers = null, time = null, repository = null } = {} }
    ) =>
      name
        ? {
            ...acc,
            [name]: {
              distTags: distTags ? Object.keys(distTags).map(tag => ({ version: distTags[tag], tag })) : null,
              maintainersCount: maintainers ? maintainers.length : null,
              releases: time
                ? Object.keys(time)
                    .filter(key => key !== 'modified' && key !== 'created')
                    .map(key => ({ time: Date.parse(time[key]), value: key }))
                    .sort((a, b) => a.time - b.time)
                : null,
              repository
            } as NpmData
          }
        : acc,
    {}
  );
};
