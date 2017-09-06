import exec from './exec';
import { join } from 'path';
import { readFileSync } from 'fs-extra';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';
import resolvePackage from './resolvePackage';

const CWD = process.cwd();
const JOB_FOLDER = 'job';
const [ , , cid, pkg ] = process.argv;

process.on('unhandledRejection', error => {
  throw error;
});

const run = async (cid: string, pkgOrJson: string) => {
  if (!cid) throw new Error('Missing correlation id');
  const { name, json } = resolvePackage(pkgOrJson);
  if (!name && !json) throw new Error('Missing or invalid package name or package.json');
  await exec(`rm -rf ${join(CWD, JOB_FOLDER)}`);
  if (name) await npmInstallByName(name, JOB_FOLDER);
  else if (json) await npmInstallByJson(json, JOB_FOLDER);
};

run(cid, pkg);
