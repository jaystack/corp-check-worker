import request = require('request-promise-native');

export default async (packageList: string[]): Promise<number[]> => {
  const dependents = [];
  for (const name of packageList) {
    const { rows: [ { value } ] } = await request.get(`http://registry.npmjs.org/-/_view/dependedUpon`, {
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
