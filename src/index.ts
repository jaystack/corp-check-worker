import exec from './exec';
import { join } from 'path';
import { install as npmInstall } from './npm';

const CWD = process.cwd();
const JOB_FOLDER = 'job';
const [ , , cid, pkg ] = process.argv;

const run = async (cid: string, pkg: string) => {
  await exec(`rm -rf ${join(CWD, JOB_FOLDER)}`);
  await npmInstall(pkg, JOB_FOLDER);
};

run(cid, pkg);
