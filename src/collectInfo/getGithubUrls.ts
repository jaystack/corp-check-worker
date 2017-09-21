import { BulkInfo } from './getBulkInfo';

const githubRepoPattern = /^git\+(https:\/\/github.com\/.+)/;

export default (bulkInfo: BulkInfo): string[] =>
  bulkInfo.map(({ repository }) => {
    if (!repository) return null;
    if (!githubRepoPattern.test(repository.url)) return null;
    const [ , url ] = githubRepoPattern.exec(repository.url);
    return url;
  });
