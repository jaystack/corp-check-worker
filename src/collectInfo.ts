import { join } from 'path';
import { readJson, readdir, pathExists } from 'fs-extra';

export type Info = {
  name: string;
  version: string;
  license: string;
  dependencies: Info[];
};

const getDependencies = async (entryPoint: string): Promise<Info[]> => {
  const modulesPath = join(entryPoint, 'node_modules');
  if (!await pathExists(modulesPath)) return [];
  const modules = await readdir(modulesPath);
};

export default async (entryPoint: string): Promise<Info> => {
  const { name, version, license } = await readJson(join(entryPoint, 'package.json'));
  return { name, version, license, dependencies: await getDependencies(entryPoint) };
};
