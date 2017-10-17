import { CWD, JOB_FOLDER, RESULT_FILE } from './consts';
import resolvePackage from './utils/resolvePackage';
import resolveJson from './utils/resolveJson';
import prepareWorkspace from './prepareWorkspace';
import collectInfo from './collectInfo';
import { writeJson } from 'fs-extra';
import complete from './aws/lambda/complete';

export default async (
  cid: string,
  pkgOrJson: string,
  { packageLockSignature, yarnLockSignature }: { packageLockSignature: string; yarnLockSignature: string }
) => {
  try {
    if (!cid) throw new Error('Missing correlation id');
    const pkg = await resolvePackage(pkgOrJson);
    if (!pkg.name && !pkg.json) throw new Error('Missing or invalid package name or package.json');
    const packageLock = await resolveJson(packageLockSignature);
    const yarnLock = await resolveJson(yarnLockSignature);
    console.log('PACKAGE:', pkg.signature || pkg.json);
    console.log('package-lock:', packageLock, 'yarn-lock:', yarnLock);
    console.log('PREPARE WORKSPACE');
    const entryPoint = await prepareWorkspace(CWD, JOB_FOLDER, pkg, { packageLock, yarnLock });
    console.log('COLLECT INFO');
    const data = await collectInfo(entryPoint);
    await writeJson(RESULT_FILE, data, { spaces: 2 });
    console.log('COMPLETE WITH DATA');
    await complete(cid, { data });
  } catch (error) {
    console.error('ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ ERROR ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ');
    console.error(error);
    console.error('^^^^^^^^^^^^^^^^^^^^^^^^^^^ ERROR ^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('COMPLETE WITH ERROR:', error.message || JSON.stringify(error));
    await complete(cid, { error: error.message || JSON.stringify(error) });
  }
};
