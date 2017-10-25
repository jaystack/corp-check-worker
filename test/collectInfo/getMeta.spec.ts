import 'jest';
jest.mock('../../src/side-effects/lambda');
jest.mock('../../src/collectInfo/getNpmScores');
const { getCache } = require('../../src/side-effects/lambda');
const getNpmScores = require('../../src/collectInfo/getNpmScores').default;
getCache.mockReturnValue(
  Promise.resolve({
    a: { npmScores: { quality: 0.5, popularity: 0.5, maintance: 0.5 } },
    b: { npmScores: { quality: 0.5, popularity: 0.5, maintance: 0.5 } },
    c: { npmScores: { quality: 0.5, popularity: 0.5, maintance: 0.5 } }
  })
);
getNpmScores.mockReturnValue(
  Promise.resolve({
    d: { quality: 0.5, popularity: 0.5, maintance: 0.5 },
    e: { quality: 0.5, popularity: 0.5, maintance: 0.5 }
  })
);

import getMeta from '../../src/collectInfo/getMeta';

describe('getMeta', () => {
  it('returns meta information about packages', async () => {
    expect(await getMeta([ 'a', 'b', 'c', 'd', 'e' ])).toEqual({
      a: { npmScores: { maintance: 0.5, popularity: 0.5, quality: 0.5 } },
      b: { npmScores: { maintance: 0.5, popularity: 0.5, quality: 0.5 } },
      c: { npmScores: { maintance: 0.5, popularity: 0.5, quality: 0.5 } },
      d: { npmScores: { maintance: 0.5, popularity: 0.5, quality: 0.5 } },
      e: { npmScores: { maintance: 0.5, popularity: 0.5, quality: 0.5 } }
    });
  });
});
