import { writeJson } from 'fs-extra';
import resolvePackage from './resolvePackage';
import prepareWorkspace from './prepareWorkspace';
import collectInfo from './collectInfo';
import invokeCompleteLambda from './invokeCompleteLambda';

const REGION = process.env.REGION || 'eu-central-1';
const COMPLETE_LAMBDA_NAME = process.env.COMPLETE_LAMBDA_NAME || 'Complete-dev';
const CWD = process.cwd();
const JOB_FOLDER = 'job';
const RESULT_FILE = 'result.json';
const [ , , cid, pkg ] = process.argv;

process.on('unhandledRejection', error => {
  throw error;
});

const run = async (cid: string, pkgOrJson: string) => {
  if (!cid) throw new Error('Missing correlation id');
  const pkg = resolvePackage(pkgOrJson);
  if (!pkg.name && !pkg.json) throw new Error('Missing or invalid package name or package.json');
  console.log('PACKAGE:', pkg.signature || pkg.json);
  try {
    const entryPoint = await prepareWorkspace(CWD, JOB_FOLDER, pkg);
    const info = await collectInfo(entryPoint);
    await writeJson(RESULT_FILE, info, { spaces: 2 });
    await invokeCompleteLambda(cid, info, { region: REGION, function: COMPLETE_LAMBDA_NAME });
  } catch (error) {
    console.error(error);
    await invokeCompleteLambda(cid, { error: error.message }, { region: REGION, function: COMPLETE_LAMBDA_NAME });
  }
};

run(cid, pkg);
