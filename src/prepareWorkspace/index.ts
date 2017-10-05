import { join } from 'path';
import { PackageSignature } from '../types';
import exec from './exec';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';

export default async (
  cwd: string,
  folder: string,
  { json, signature, scope, name }: PackageSignature & { json?: string },
  { packageLock, yarnLock }: { packageLock: any; yarnLock: any }
): Promise<string> => {
  await exec(`rm -rf ${join(cwd, folder)}`);
  if (name) await npmInstallByName(signature, folder);
  else if (json) await npmInstallByJson(json, folder, { exec: { stream: process.stdout }, packageLock });

  if (scope && name) {
    return join(cwd, folder, 'node_modules', '@' + scope, name);
  } else if (name) {
    return join(cwd, folder, 'node_modules', name);
  } else {
    return join(cwd, folder);
  }
};
