import { Lambda } from 'aws-sdk';
import exec from './exec';
import { join } from 'path';
import { readFileSync, writeJson } from 'fs-extra';
import { installByName as npmInstallByName, installByJson as npmInstallByJson } from './npm';
import resolvePackage from './resolvePackage';
import collectInfo, { Info } from './collectInfo';

const COMPLETE_LAMBDA_NAME = 'Complete-dev';
const CWD = process.cwd();
const JOB_FOLDER = 'job';
const [ , , cid, pkg, isProduction ] = process.argv;

process.on('unhandledRejection', error => {
  throw error;
});

const invokeCompleteLambda = (cid: string, data: Info) =>
  new Promise((resolve, reject) =>
    new Lambda().invoke(
      { FunctionName: COMPLETE_LAMBDA_NAME, Payload: JSON.stringify({ cid, data }) },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  );

const run = async (cid: string, pkgOrJson: string, isProduction: boolean = false) => {
  if (!cid) throw new Error('Missing correlation id');
  const { scope, name, version, json } = resolvePackage(pkgOrJson);
  if (!name && !json) throw new Error('Missing or invalid package name or package.json');
  
  await exec(`rm -rf ${join(CWD, JOB_FOLDER)}`);
  if (name) await npmInstallByName(`${scope}${name}${version}`, JOB_FOLDER, isProduction);
  else if (json) await npmInstallByJson(json, JOB_FOLDER, isProduction);

  const entryPoint = name ? join(CWD, JOB_FOLDER, 'node_modules', name) : join(CWD, JOB_FOLDER);
  const info = await collectInfo(entryPoint);
  await writeJson('result.json', info, { spaces: 2 });
  await invokeCompleteLambda(cid, info);
};

run(cid, pkg, !!isProduction);
