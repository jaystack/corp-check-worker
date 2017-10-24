import resolvePackage from '../../src/utils/resolvePackage';

describe('resolvePackage', () => {
  it('parses JSON if input is JSON', () => {
    expect(resolvePackage('{"a": 1}')).toEqual({ json: { a: 1 } });
  });

  it('returns resolved npm package name if input is that', () => {
    expect(resolvePackage('express')).toEqual({
      fullName: 'express',
      name: 'express',
      signature: 'express'
    });
  });
});
