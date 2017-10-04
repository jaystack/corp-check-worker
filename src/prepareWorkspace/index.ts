import { join } from 'path';
import { PackageSignature } from '../types';
import { readdir } from 'fs-extra';
import exec from './exec';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';

export default async (
  cwd: string,
  folder: string,
  { json, signature, scope, name }: PackageSignature & { json?: string }
): Promise<string> => {
  await exec(`rm -rf ${join(cwd, folder)}`);
  if (name) await npmInstallByName(signature, folder);
  else if (json) await npmInstallByJson(json, folder);

  console.log(await readdir(join(cwd, folder)));
  console.log(await readdir(join(cwd, folder, 'node_modules')));

  if (scope && name) {
    return join(cwd, folder, 'node_modules', '@' + scope, name);
  } else if (name) {
    return join(cwd, folder, 'node_modules', name);
  } else {
    return join(cwd, folder);
  }
};
