import { join } from 'path';
import { PackageSignature } from 'corp-check-core';
import exec from './exec';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';

export default async (
  cwd: string,
  folder: string,
  { json, signature, scope, name }: PackageSignature & { json?: string },
  { packageLock, yarnLock, production }: { packageLock: any; yarnLock: any; production: boolean }
): Promise<string> => {
  await exec(`rm -rf ${join(cwd, folder)}`);
  if (name) await npmInstallByName(signature, folder, { exec: { stream: process.stdout } });
  else if (json) await npmInstallByJson(json, folder, { exec: { stream: process.stdout }, packageLock, production });

  if (scope && name) {
    return join(cwd, folder, 'node_modules', '@' + scope, name);
  } else if (name) {
    return join(cwd, folder, 'node_modules', name);
  } else {
    return join(cwd, folder);
  }
};
