import { ensureDir, writeJSON } from 'fs-extra';
import { join } from 'path';
import exec, { ExecOptions } from './exec';

export const installByName = (pkg: string, folder: string, { exec: execOptions = {} }: { exec?: ExecOptions }) =>
  exec(`npm install --no-save --legacy-bundling --prefix ${folder} ${pkg}`, { ...execOptions });

export const installByJson = async (
  json: string,
  folder: string,
  { exec: execOptions = {}, packageLock, production }: { exec?: ExecOptions; packageLock: any; production: boolean }
) => {
  await ensureDir(folder);
  await writeJSON(join(folder, 'package.json'), json);
  if (packageLock) {
    await writeJSON(join(folder, 'package-lock.json'), packageLock);
  }
  return await exec(`npm install --legacy-bundling ${production ? '--production' : ''}`, {
    ...execOptions,
    cwd: folder
  });
};
