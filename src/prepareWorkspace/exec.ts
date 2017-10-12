import execa = require('execa');

export type ExecOptions = { cwd?: string; stream?: NodeJS.WritableStream };

export default async (command: string, { cwd = process.cwd(), stream = null }: ExecOptions = {}) => {
  console.log('CWD:', cwd);
  console.log('COMMAND:', command);
  const promise = execa.shell(command, { cwd });
  if (stream) {
    promise.stdout.pipe(stream);
    promise.stderr.pipe(stream);
  }
  const result = await promise;
  return result.stdout;
};
