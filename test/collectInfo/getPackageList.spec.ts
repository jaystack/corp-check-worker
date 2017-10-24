import { Node } from 'corp-check-core';
import getPackageList from '../../src/collectInfo/getPackageList';

describe('getPackageList', () => {
  it('returns the package list by a tree', () => {
    expect(
      getPackageList(<Node>{
        name: 'a',
        dependencies: [
          { name: 'b', dependencies: [] },
          { name: 'c', dependencies: [ { name: 'd', dependencies: [] } ] }
        ]
      })
    ).toEqual([ 'a', 'b', 'c', 'd' ]);
  });

  it('throws if it misses a "dependencies" property in any node', () => {
    expect(() => getPackageList(<Node>{ name: 'repatch' })).toThrow();
  });
});
