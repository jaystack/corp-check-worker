import request = require('request-promise-native');

export default async (packageList: string[]) => {
  const { rows } = await request.post('https://replicate.npmjs.com/registry/_all_docs?include_docs=true', {
    json: true,
    body: { keys: packageList }
  });
  return rows.map(({ doc }) => doc || {});
};
