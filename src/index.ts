import exec from './exec';
import { join } from 'path';
import { readFileSync } from 'fs-extra';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';

const CWD = process.cwd();
const JOB_FOLDER = 'job';
const packageNamePattern = /.+/; // TODO: determine pattern
const [ , , cid, pkgOrJson ] = process.argv;

process.on('unhandledRejection', error => {
  throw error;
});

const resolvePackage = (pkgOrJson: string) => {
  try {
    return { json: JSON.parse(pkgOrJson), pkg: null };
  } catch (err) {
    return packageNamePattern.test(pkgOrJson) ? { pkg: pkgOrJson, json: null } : { pkg: null, json: null };
  }
};

const run = async (cid: string, pkgOrJson: string) => {
  if (!cid) throw new Error('Missing correlation id');
  const { pkg, json } = resolvePackage(pkgOrJson);
  if (!pkg && !json) throw new Error('Missing package name or package.json');
  await exec(`rm -rf ${join(CWD, JOB_FOLDER)}`);
  if (pkg) await npmInstallByName(pkg, JOB_FOLDER);
  else if (json) await npmInstallByJson(json, JOB_FOLDER);
};

run(cid, pkgOrJson);
