import { join } from 'path';
import exec from './exec';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';

export default async (
  cwd: string,
  folder: string,
  {
    json,
    scope,
    name,
    version,
    isProduction
  }: {
    json: any;
    scope: string;
    name: string;
    version: string;
    isProduction: boolean;
  }
): Promise<string> => {
  await exec(`rm -rf ${join(cwd, folder)}`);
  if (name) await npmInstallByName(`${scope}${name}${version}`, folder, isProduction);
  else if (json) await npmInstallByJson(json, folder, isProduction);
  return name ? join(cwd, folder, 'node_modules', name) : join(cwd, folder);
};
