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
const [ , , cid, pkg, isProduction ] = process.argv;

process.on('unhandledRejection', error => {
  throw error;
});

const run = async (cid: string, pkgOrJson: string, isProduction: boolean = false) => {
  if (!cid) throw new Error('Missing correlation id');
  const { scope, name, version, json } = resolvePackage(pkgOrJson);
  if (!name && !json) throw new Error('Missing or invalid package name or package.json');
  const entryPoint = await prepareWorkspace(CWD, JOB_FOLDER, { json, scope, name, version, isProduction });
  const info = await collectInfo(entryPoint);
  await writeJson(RESULT_FILE, info, { spaces: 2 });
  await invokeCompleteLambda(cid, info, { region: REGION, function: COMPLETE_LAMBDA_NAME });
};

run(cid, pkg, !!isProduction);
