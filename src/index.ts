import { writeJson } from 'fs-extra';
import resolvePackage from './resolvePackage';
import prepareWorkspace from './prepareWorkspace';
import collectInfo from './collectInfo';
import invokeLambda from './invokeLambda';
import { CWD, JOB_FOLDER, RESULT_FILE, REGION, COMPLETE_LAMBDA_NAME } from './consts';

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
    await invokeLambda(REGION, COMPLETE_LAMBDA_NAME, { cid, data: info });
  } catch (error) {
    console.error(error);
    await invokeLambda(REGION, COMPLETE_LAMBDA_NAME, { cid, data: { error: error.message } });
  }
};

run(cid, pkg);
