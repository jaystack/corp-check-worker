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
    version
  }: {
    json: any;
    scope: string;
    name: string;
    version: string;
  }
): Promise<string> => {
  console.log("prepare workspace...")
  await exec(`rm -rf ${join(cwd, folder)}`);
  if (name) await npmInstallByName(`${scope}${name}${version}`, folder);
  else if (json) await npmInstallByJson(json, folder);
  console.log("done");
  return name ? join(cwd, folder, 'node_modules', name) : join(cwd, folder);
};
