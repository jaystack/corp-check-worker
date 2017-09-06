import { ensureDir, writeJSON } from 'fs-extra';
import { join } from 'path';
import exec, { ExecOptions } from './exec';

export const installByName = (pkg: string, folder: string, options?: ExecOptions) =>
  exec(`npm install --no-save --legacy-bundling --prefix ${folder} ${pkg}`, options);

export const installByJson = async (json: string, folder: string, options?: ExecOptions) => {
  await ensureDir(folder);
  await writeJSON(join(folder, 'package.json'), json);
  return await exec(`npm install --legacy-bundling`, { ...options, cwd: folder });
};
