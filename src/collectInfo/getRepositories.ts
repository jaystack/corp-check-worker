import { NpmData } from './getNpmData';

const githubRepoPattern = /^git\+https:\/\/github.com\/(.+)\/(.+)\.git/;

export default (npmData: NpmData): { owner: string; repo: string }[] =>
  npmData.map(({ repository }) => {
    if (!repository) return null;
    if (!githubRepoPattern.test(repository.url)) return null;
    const [ , owner, repo ] = githubRepoPattern.exec(repository.url);
    return { owner, repo };
  });
