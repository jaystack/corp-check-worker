import program = require('commander');
const packageJson = require('../package.json');
import run from './run';

process.on('unhandledRejection', error => {
  throw error;
});

program.version(packageJson.version);

program
  .command('do <cid> <pkg>')
  .option('--package-lock <package-lock>', 'package-lock.json file')
  .option('--yarn-lock <yarn-lock>', 'yarn.lock file')
  .action(async (cid: string, pkgOrJson: string, options) => {
    await run(cid, pkgOrJson, {
      packageLockSignature: options.packageLock,
      yarnLockSignature: options.yarnLock
    });
  });

program.command('listen').action(async () => {
  console.log('listening');
});

program.parse(process.argv);
