import 'jest';
jest.mock('fs-extra');
jest.mock('../../src/side-effects/resolveLicense');
const { readJson, readdir, pathExists } = require('fs-extra');
const resolveLicense = require('../../src/side-effects/resolveLicense').default;
import getTree from '../../src/collectInfo/getTree';

const folderStrucutre = {
  'package.json': { name: 'a', version: 'a', license: 'a' },
  node_modules: {
    '@s': {
      e: {
        'package.json': { name: 'e', version: 'e', license: 'e' }
      },
      f: {
        'package.json': { name: 'f', version: 'f', license: 'f' }
      }
    },
    b: {
      'package.json': { name: 'b', version: 'b', license: 'b' },
      node_modules: {
        d: {
          'package.json': { name: 'd', version: 'd', license: 'd' }
        }
      }
    },
    c: {
      'package.json': { name: 'c', version: 'c', license: 'c' }
    }
  }
};

const expectedResult = {
  name: 'a',
  version: 'a',
  license: { type: 'a', hasLicenseFile: false, isPrivate: false },
  dependencies: [
    {
      name: 'b',
      version: 'b',
      license: { type: 'b', hasLicenseFile: false, isPrivate: false },
      dependencies: [
        {
          name: 'd',
          version: 'd',
          license: { type: 'd', hasLicenseFile: false, isPrivate: false },
          dependencies: []
        }
      ]
    },
    {
      name: 'c',
      version: 'c',
      license: { type: 'c', hasLicenseFile: false, isPrivate: false },
      dependencies: []
    },
    {
      name: 'e',
      version: 'e',
      license: { type: 'e', hasLicenseFile: false, isPrivate: false },
      dependencies: []
    },
    {
      name: 'f',
      version: 'f',
      license: { type: 'f', hasLicenseFile: false, isPrivate: false },
      dependencies: []
    }
  ]
};

const getByPath = (path: string, structure: object) => {
  const [ first, ...others ] = path.split('/').filter(_ => _);
  if (!first) return structure || null;
  if (others.length === 0) return structure[first];
  else return getByPath(others.join('/'), structure[first]);
};

readJson.mockImplementation(path => getByPath(path, folderStrucutre));
resolveLicense.mockImplementation(path => ({
  type: getByPath(path + '/package.json', folderStrucutre).license,
  hasLicenseFile: false,
  isPrivate: false
}));
pathExists.mockImplementation(path => !!getByPath(path, folderStrucutre));
readdir.mockImplementation(path => Object.keys(getByPath(path, folderStrucutre)));

describe('getTree', () => {
  it('works properly', async () => {
    expect(await getTree('')).toEqual(expectedResult);
  });
});
