import { filterRegularFolders, filterScopedFolders } from '../../src/utils/filterFolders';

describe('filterFolders', () => {
  const files = [ '@types', '@angular', 'express', 'react', 'redux' ];

  it('filterRegularFolders', () => {
    expect(filterRegularFolders(files)).toEqual([ 'express', 'react', 'redux' ]);
  });

  it('filterScopedFolders', () => {
    expect(filterScopedFolders(files)).toEqual([ '@types', '@angular' ]);
  });
});
