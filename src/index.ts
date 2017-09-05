import exec from './exec';
import { join } from 'path';
import { install as npmInstall } from './npm';

const CWD = process.cwd();
const JOB_FOLDER = 'job';
const [ , , cid, pkg ] = process.argv;

process.on('unhandledRejection', error => {
  throw error;
});

const run = async (cid: string, pkg: string) => {
  if (!cid) throw new Error('Missing correlation id');
  if (!pkg) throw new Error('Missing package name');
  await exec(`rm -rf ${join(CWD, JOB_FOLDER)}`);
  await npmInstall(pkg, JOB_FOLDER);
};

run(cid, pkg);
