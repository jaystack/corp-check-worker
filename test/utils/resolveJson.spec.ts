import resolveJson from '../../src/utils/resolveJson';

describe('resolveJson', () => {
  it('parses valid JSON', () => {
    expect(resolveJson('{"a": 1}')).toEqual({ a: 1 });
  });

  it('returns null at invalid JSON', () => {
    expect(resolveJson('{"a: 1}')).toEqual(null);
  });
});
