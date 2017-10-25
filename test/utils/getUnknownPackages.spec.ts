import 'jest';
jest.mock('../../src/side-effects/npm');
const getPackages = require('../../src/side-effects/npm').getPackages;
import getUnknownPackages from '../../src/utils/getUnknownPackages';

const packageJson = {
  dependencies: {
    asdasdasd: 'latest',
    repatch: 'latest'
  },
  devDependencies: {
    qweqweqwe: 'latest',
    '@types/node': 'latest'
  }
};

describe('getUnknownPackages', () => {
  it('returns empty array if package.json is not defined', async () => {
    getPackages.mockReturnValue(Promise.resolve([]));
    expect(await getUnknownPackages(undefined, false)).toEqual([]);
    expect(await getUnknownPackages(undefined, true)).toEqual([]);
  });

  it('resolves unknown packages in production mode', async () => {
    getPackages.mockReturnValue(Promise.resolve([ { key: 'asdasdasd', error: 'not_found' }, { key: 'repatch' } ]));
    expect(await getUnknownPackages(packageJson, true)).toEqual([ 'asdasdasd' ]);
  });

  it('resolves unknown packages in non-production mode', async () => {
    getPackages.mockReturnValue(
      Promise.resolve([
        { key: 'asdasdasd', error: 'not_found' },
        { key: 'repatch' },
        { key: 'qweqweqwe', error: 'not_found' },
        { key: '@types/node' }
      ])
    );
    expect(await getUnknownPackages(packageJson, false)).toEqual([ 'asdasdasd', 'qweqweqwe' ]);
  });
});
