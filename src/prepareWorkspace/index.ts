import { join } from 'path';
import { PackageSignature } from 'corp-check-core';
import exec from '../side-effects/exec';
import { installByName, installByJson } from './npm';

export default async (
  cwd: string,
  folder: string,
  { json, signature, scope, name }: PackageSignature & { json?: string },
  {
    packageLock,
    yarnLock,
    production,
    unknownPackages
  }: { packageLock: any; yarnLock: any; production: boolean; unknownPackages: string[] }
): Promise<string> => {
  await exec(`rm -rf ${join(cwd, folder)}`);
  if (name) await installByName(signature, folder, { exec: { stream: process.stdout } });
  else if (json)
    await installByJson(json, folder, {
      exec: { stream: process.stdout },
      packageLock,
      production,
      unknownPackages
    });

  if (scope && name) {
    return join(cwd, folder, 'node_modules', '@' + scope, name);
  } else if (name) {
    return join(cwd, folder, 'node_modules', name);
  } else {
    return join(cwd, folder);
  }
};
