import { Registry } from '../types';
import { getNpmPackages } from '../side-effects/npm';

const getPackageAvailabilities = async (packageNames: string[]): Promise<Registry<boolean>> => {
  const results = await getNpmPackages(packageNames);
  return results.reduce((acc, { key, error }) => ({ ...acc, [key]: !error }), {});
};

export default async (json: any, production: boolean): Promise<string[]> => {
  if (!json) return [];
  const dependencies = production ? json.dependencies : { ...json.dependencies, ...json.devDependencies };
  const packageNames = Object.keys(dependencies);
  const packageAvailabilities = await getPackageAvailabilities(packageNames);
  return Object.keys(packageAvailabilities).filter(name => !packageAvailabilities[name]);
};
