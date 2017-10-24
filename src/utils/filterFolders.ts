import { packageName as packageNamePattern, scope as scopePattern } from '../consts';

const getSubFolders = (predicate: (file: string) => boolean) => (files: string[]): string[] => files.filter(predicate);

export const filterRegularFolders = getSubFolders(file => packageNamePattern.test(file));

export const filterScopedFolders = getSubFolders(file => scopePattern.test(file));
