import 'jest';
jest.mock('../../src/side-effects/exec');
const exec = require('../../src/side-effects/exec').default;
exec.mockImplementation(() => Promise.resolve());
jest.mock('../../src/prepareWorkspace/npm');
const { installByName, installByJson } = require('../../src/prepareWorkspace/npm');
installByName.mockImplementation(() => Promise.resolve());
installByJson.mockImplementation(() => Promise.resolve());

import prepareWorkspace from '../../src/prepareWorkspace';

describe('prepareWorkspace', () => {
  const defaultOptions = { exec: { stream: process.stdout } };

  beforeEach(() => {
    exec.mockClear();
    installByName.mockClear();
    installByJson.mockClear();
  });

  it('installs properly by name', async () => {
    expect(
      await prepareWorkspace(
        '/cwd',
        'job',
        { signature: 'repatch', name: 'repatch' },
        { packageLock: undefined, yarnLock: undefined, production: false, unknownPackages: [] }
      )
    ).toEqual('/cwd/job/node_modules/repatch');
    expect(exec).toBeCalledWith('rm -rf /cwd/job');
    expect(installByName).toBeCalledWith('repatch', 'job', { ...defaultOptions });
  });

  it('installs properly by name with scope', async () => {
    expect(
      await prepareWorkspace(
        '/cwd',
        'job',
        { signature: '@types/node', name: 'node', scope: 'types' },
        { packageLock: undefined, yarnLock: undefined, production: false, unknownPackages: [] }
      )
    ).toEqual('/cwd/job/node_modules/@types/node');
    expect(exec).toBeCalledWith('rm -rf /cwd/job');
    expect(installByName).toBeCalledWith('@types/node', 'job', { ...defaultOptions });
  });

  it('installs properly by json', async () => {
    expect(
      await prepareWorkspace(
        '/cwd',
        'job',
        { json: {} },
        { packageLock: undefined, yarnLock: undefined, production: false, unknownPackages: [] }
      )
    ).toEqual('/cwd/job');
    expect(exec).toBeCalledWith('rm -rf /cwd/job');
    expect(installByJson).toBeCalledWith({}, 'job', {
      ...defaultOptions,
      packageLock: undefined,
      production: false,
      unknownPackages: []
    });
  });
});
