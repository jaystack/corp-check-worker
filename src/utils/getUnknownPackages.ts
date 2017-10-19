import request = require('request-promise-native');
import { Registry } from '../types';

const getPackageAvailabilities = async (packageNames: string[]): Promise<Registry<boolean>> => {
  const { rows } = await request.post('https://replicate.npmjs.com/registry/_all_docs', {
    json: true,
    body: { keys: packageNames }
  });
  return rows.reduce((acc, { key, error }) => ({ ...acc, [key]: !error }), {});
};

export default async (json: any, production: boolean): Promise<string[]> => {
  if (!json) return [];
  const dependencies = production ? json.dependencies : { ...json.dependencies, ...json.devDependencies };
  const packageNames = Object.keys(dependencies);
  const packageAvailabilities = await getPackageAvailabilities(packageNames);
  return Object.keys(packageAvailabilities).filter(name => !packageAvailabilities[name]);
};
