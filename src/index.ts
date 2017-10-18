import program = require('commander');
import run from './run';
import listen from './listen';

const packageJson = require('../package.json');

process.on('unhandledRejection', error => {
  throw error;
});

program.version(packageJson.version);

program
  .command('do <cid> <pkg>')
  .option('--package-lock <package-lock>', 'package-lock.json file')
  .option('--yarn-lock <yarn-lock>', 'yarn.lock file')
  .option('--production', 'Run in production mode')
  .action(run);

program.command('listen').action(listen);

program.parse(process.argv);
