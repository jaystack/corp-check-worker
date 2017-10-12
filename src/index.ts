import program = require('commander');
import { writeJson } from 'fs-extra';
import resolvePackage from './utils/resolvePackage';
import resolveJson from './utils/resolveJson';
import prepareWorkspace from './prepareWorkspace';
import collectInfo from './collectInfo';
import complete from './aws/lambda/complete';
import { CWD, JOB_FOLDER, RESULT_FILE } from './consts';
const packageJson = require('../package.json');

process.on('unhandledRejection', error => {
  throw error;
});

program
  .version(packageJson.version)
  .arguments('<cid> <pkg>')
  .option('--package-lock <package-lock>', 'package-lock.json file')
  .option('--yarn-lock <yarn-lock>', 'yarn.lock file')
  .action(async (cid: string, pkgOrJson: string) => {
    try {
      if (!cid) throw new Error('Missing correlation id');
      const pkg = await resolvePackage(pkgOrJson);
      if (!pkg.name && !pkg.json) throw new Error('Missing or invalid package name or package.json');
      const packageLock = await resolveJson(program.packageLock);
      const yarnLock = await resolveJson(program.yarnLock);
      console.log('PACKAGE:', pkg.signature || pkg.json);
      console.log('package-lock:', packageLock, 'yarn-lock:', yarnLock);
      console.log('PREPARE WORKSPACE');
      const entryPoint = await prepareWorkspace(CWD, JOB_FOLDER, pkg, { packageLock, yarnLock });
      console.log('ENTRYPOINT:', entryPoint);
      console.log('COLLECT INFO');
      const data = await collectInfo(entryPoint);
      await writeJson(RESULT_FILE, data, { spaces: 2 });
      console.log('COMPLETE WITH DATA:', data);
      await complete(cid, { data });
    } catch (error) {
      console.error('ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ ERROR ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ');
      console.error(error);
      console.error('^^^^^^^^^^^^^^^^^^^^^^^^^^^ ERROR ^^^^^^^^^^^^^^^^^^^^^^^^^^^');
      console.log('COMPLETE WITH ERROR:', error.message || JSON.stringify(error));
      await complete(cid, { error: error.message || JSON.stringify(error) });
    }
  })
  .parse(process.argv);
