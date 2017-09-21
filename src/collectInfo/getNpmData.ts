import request = require('request-promise-native');
import { Assignment, Repository } from '../types';

export type NpmData = {
  distTags: Assignment<string>;
  releases: Assignment<number>;
  maintainersCount: number;
  repository: Repository;
}[];

export default async (packageList: string[]): Promise<NpmData> => {
  const { rows } = await request.post('https://replicate.npmjs.com/registry/_all_docs?include_docs=true', {
    json: true,
    body: { keys: packageList }
  });
  return rows.map(
    ({ doc: { 'dist-tags': distTags = null, maintainers = null, time = null, repository = null } = {} }) => ({
      distTags,
      maintainersCount: maintainers ? maintainers.length : null,
      releases: time ? Object.keys(time).reduce((acc, key) => ({ ...acc, [key]: Date.parse(time[key]) }), {}) : null,
      repository
    })
  );
};
