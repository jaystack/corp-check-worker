import 'jest';
jest.mock('fs-extra');
jest.mock('../../src/side-effects/exec');
const { ensureDir, writeJSON } = require('fs-extra');
const exec = require('../../src/side-effects/exec').default;

import { installByJson, installByName } from '../../src/prepareWorkspace/npm';

exec.mockReturnValue(Promise.resolve());
ensureDir.mockReturnValue(Promise.resolve());
writeJSON.mockReturnValue(Promise.resolve());

describe('npm', () => {
  beforeEach(() => {
    exec.mockClear();
    ensureDir.mockClear();
    writeJSON.mockClear();
  });

  describe('installByName', () => {
    it('invokes exec with the proper arguments', async () => {
      await installByName('repatch', 'job', { exec: { cwd: 'foo' } });
      expect(exec).toBeCalledWith('npm install --no-save --legacy-bundling --prefix job repatch', { cwd: 'foo' });
    });
  });

  describe('installByJson', () => {
    const folder = 'job';
    const unknownPackages = [ 'asdasd', 'qweqwe' ];
    const json = { name: 'test', dependencies: { asdasd: 'latest' }, devDependencies: { qweqwe: 'latest' } };

    it('works properly at basic usage', async () => {
      await installByJson(json, folder, { production: false, unknownPackages });
      expect(ensureDir).toBeCalledWith(folder);
      expect(writeJSON).toBeCalledWith('job/package.json', { ...json, dependencies: {}, devDependencies: {} });
      expect(exec).toBeCalledWith('npm install --legacy-bundling', { cwd: folder });
    });

    it('works properly at production mode', async () => {
      await installByJson(json, folder, { production: true, unknownPackages });
      expect(ensureDir).toBeCalledWith(folder);
      expect(writeJSON).toBeCalledWith('job/package.json', { ...json, dependencies: {}, devDependencies: {} });
      expect(exec).toBeCalledWith('npm install --legacy-bundling --production', { cwd: folder });
    });

    it('works properly with package.lock', async () => {
      await installByJson(json, folder, { production: false, unknownPackages, packageLock: [] });
      expect(ensureDir).toBeCalledWith(folder);
      expect(writeJSON.mock.calls[0]).toEqual([
        'job/package.json',
        { ...json, dependencies: {}, devDependencies: {} }
      ]);
      expect(writeJSON.mock.calls[1]).toEqual([ 'job/package-lock.json', [] ]);
      expect(exec).toBeCalledWith('npm install --legacy-bundling', { cwd: folder });
    });
  });
});
