import exec, { ExecOptions } from './exec';

export const install = (pkg: string, folder: string, options?: ExecOptions) =>
  exec(`npm install --no-save --legacy-bundling --prefix ${folder} ${pkg}`, options);
