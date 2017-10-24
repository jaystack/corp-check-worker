import 'jest';
jest.mock('../../src/side-effects/npm');
const { search } = require('../../src/side-effects/npm');

import getNpmScores from '../../src/collectInfo/getNpmScores';

search.mockImplementation(name =>
  Promise.resolve([
    { package: { name }, score: { detail: { quality: 0.5, popularity: 0.5, maintance: 0.5 } } },
    { package: { name: 'noise1' }, score: { detail: { quality: 0.5, popularity: 0.5, maintance: 0.5 } } },
    { package: { name: 'noise2' }, score: { detail: { quality: 0.5, popularity: 0.5, maintance: 0.5 } } },
    { package: { name: 'noise3' }, score: { detail: { quality: 0.5, popularity: 0.5, maintance: 0.5 } } },
    { package: { name: 'noise4' }, score: { detail: { quality: 0.5, popularity: 0.5, maintance: 0.5 } } }
  ])
);

describe('getNpmScores', () => {
  it('returns npm scores', async () => {
    const packageNames = [ 'a', 'b', 'c', 'd', 'e' ];
    expect(await getNpmScores(packageNames)).toEqual({
      a: { quality: 0.5, popularity: 0.5, maintance: 0.5 },
      b: { quality: 0.5, popularity: 0.5, maintance: 0.5 },
      c: { quality: 0.5, popularity: 0.5, maintance: 0.5 },
      d: { quality: 0.5, popularity: 0.5, maintance: 0.5 },
      e: { quality: 0.5, popularity: 0.5, maintance: 0.5 }
    });
  });
});
