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
  const { scope, name, version, json } = resolvePackage(pkgOrJson);
  console.log(scope, name, version);
  if (!name && !json) throw new Error('Missing or invalid package name or package.json');
  await exec(`rm -rf ${join(CWD, JOB_FOLDER)}`);
  if (name) await npmInstallByName(`${scope}${name}${version}`, JOB_FOLDER);
  else if (json) await npmInstallByJson(json, JOB_FOLDER);
  const entryPoint = name ? join(JOB_FOLDER, 'node_modules', name) : JOB_FOLDER;
};

run(cid, pkg);
