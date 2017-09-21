import request = require('request-promise-native');
import sleep from '../sleep';

export default async (packageList: string[]): Promise<number[]> => {
  const dependents = [];
  for (const name of packageList) {
    const {
      rows: [ { value } ]
    } = await request.get(`https://replicate.npmjs.com/registry/_design/app/_view/dependedUpon`, {
      json: true,
      qs: {
        group_level: 1,
        start_key: `["${name}"]`,
        end_key: `["${name}", {}]`
      }
    });
    dependents.push(value);
  }
  return dependents;
};
