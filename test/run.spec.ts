import 'jest';
jest.mock('fs-extra');
jest.mock('../src/utils/getUnknownPackages');
jest.mock('../src/prepareWorkspace');
jest.mock('../src/collectInfo');
jest.mock('../src/side-effects/lambda');
const { writeJson } = require('fs-extra');
const getUnknownPackages = require('../src/utils/getUnknownPackages').default;
const prepareWorkspace = require('../src/prepareWorkspace').default;
const collectInfo = require('../src/collectInfo').default;
const { complete } = require('../src/side-effects/lambda');
import { CWD, JOB_FOLDER, RESULT_FILE } from '../src/consts';
import run from '../src/run';

const unknownPackages = [ 'asdasd', 'qweqwe' ];
const entryPoint = '/foo/bar';
const packageLockSignature = '{"a": 1}';
const packageLock = { a: 1 };
const yarnLockSignature = '{"b": 1}';
const yarnLock = { b: 1 };
const production = false;
const info = { tree: {}, meta: {}, unknownPackages };

writeJson.mockReturnValue(Promise.resolve());
getUnknownPackages.mockReturnValue(Promise.resolve(unknownPackages));
prepareWorkspace.mockReturnValue(Promise.resolve(entryPoint));
collectInfo.mockReturnValue(Promise.resolve(info));
complete.mockReturnValue(Promise.resolve());

describe('run', () => {
  beforeEach(() => {
    writeJson.mockClear();
    getUnknownPackages.mockClear();
    prepareWorkspace.mockClear();
    collectInfo.mockClear();
    complete.mockClear();
  });

  it('throws if no cid provided', async () => {
    await run('', 'repatch', { packageLock: packageLockSignature, yarnLock: yarnLockSignature, production });
    expect(complete).toBeCalledWith('', { error: 'Missing correlation id' });
  });

  it('throws if no package provided', async () => {
    await run('1', '', { packageLock: packageLockSignature, yarnLock: yarnLockSignature, production });
    expect(complete).toBeCalledWith('1', { error: 'Missing or invalid package name or package.json' });
  });

  it('works properly with package name', async () => {
    await run('1', '@types/node@1.0.0', { packageLock: packageLockSignature, yarnLock: yarnLockSignature, production });
    expect(getUnknownPackages).toBeCalledWith(undefined, production);
    expect(prepareWorkspace).toBeCalledWith(
      CWD,
      JOB_FOLDER,
      {
        fullName: '@types/node',
        name: 'node',
        rawScope: '@types/',
        rawVersion: '@1.0.0',
        scope: 'types',
        signature: '@types/node@1.0.0',
        version: '1.0.0'
      },
      { packageLock, yarnLock, production, unknownPackages }
    );
    expect(collectInfo).toBeCalledWith(entryPoint, unknownPackages);
    expect(writeJson).toBeCalledWith(RESULT_FILE, info, { spaces: 2 });
    expect(complete).toBeCalledWith('1', { data: info });
  });

  it('works properly with package.json', async () => {
    await run('1', '{"name": "repatch"}', {
      packageLock: packageLockSignature,
      yarnLock: yarnLockSignature,
      production
    });
    expect(getUnknownPackages).toBeCalledWith({ name: 'repatch' }, production);
    expect(prepareWorkspace).toBeCalledWith(
      CWD,
      JOB_FOLDER,
      { json: { name: 'repatch' } },
      { packageLock, yarnLock, production, unknownPackages }
    );
    expect(collectInfo).toBeCalledWith(entryPoint, unknownPackages);
    expect(writeJson).toBeCalledWith(RESULT_FILE, info, { spaces: 2 });
    expect(complete).toBeCalledWith('1', { data: info });
  });
});
