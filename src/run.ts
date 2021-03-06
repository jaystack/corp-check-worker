import { CWD, JOB_FOLDER, RESULT_FILE } from './consts';
import resolvePackage from './utils/resolvePackage';
import resolveJson from './utils/resolveJson';
import getUnknownPackages from './utils/getUnknownPackages';
import prepareWorkspace from './prepareWorkspace';
import collectInfo from './collectInfo';
import { writeJson } from 'fs-extra';
import { complete, updateProgress } from './side-effects/lambda';
import errorHandler from './errorHandler';

const handleError = cid => async error => {
  console.error('ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ ERROR ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ');
  console.error(error);
  console.error('^^^^^^^^^^^^^^^^^^^^^^^^^^^ ERROR ^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  console.log('COMPLETE WITH ERROR:', error.message || JSON.stringify(error));
  console.log('ERROR MESSAGE:', error.msg || '');
  await complete(cid, { error: error.message || JSON.stringify(error), message: error.msg });
};

export default async (
  cid: string,
  pkgOrJson: string,
  {
    packageLock: packageLockSignature,
    yarnLock: yarnLockSignature,
    production = false
  }: { packageLock: string; yarnLock: string; production: boolean }
) => {
  console.log('\nˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ\n');
  try {
    if (!cid) throw new Error('Missing correlation id');
    errorHandler.subscribe(handleError(cid));
    const pkg = resolvePackage(pkgOrJson);
    if (!pkg.name && !pkg.json) throw new Error('Missing or invalid package name or package.json');
    const packageLock = resolveJson(packageLockSignature);
    const yarnLock = resolveJson(yarnLockSignature);
    console.log('CID:', cid);
    console.log('PACKAGE:', pkg.signature || pkg.json);
    console.log('package-lock:', packageLock, 'yarn-lock:', yarnLock, 'production', production);
    await updateProgress(cid, '1/4 - Checking package availabilities');
    const unknownPackages = await getUnknownPackages(pkg.json, production);
    console.log('UNKNOWN PACKAGES:', unknownPackages);
    console.log('PREPARE WORKSPACE');
    await updateProgress(cid, '2/4 - Installing');
    const entryPoint = await prepareWorkspace(CWD, JOB_FOLDER, pkg, {
      packageLock,
      yarnLock,
      production,
      unknownPackages
    });
    console.log('COLLECT INFO');
    await updateProgress(cid, '3/4 - Collecting info');
    const data = await collectInfo(entryPoint, unknownPackages);
    await writeJson(RESULT_FILE, data, { spaces: 2 });
    console.log('COMPLETE WITH DATA');
    await updateProgress(cid, '4/4 - Completing');
    await complete(cid, { data });
  } catch (error) {
    await handleError(cid)(error);
  }
  console.log('\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n');
};
