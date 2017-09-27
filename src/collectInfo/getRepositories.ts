import { NpmData, Registry } from '../types';

const githubRepoPattern = /github\.com\/([^./]+)\/([^./]+)(\.git)?$/;

export default (npmData: { [name: string]: NpmData }): Registry<{ owner: string; repo: string }> =>
  Object.keys(npmData).reduce((acc, name) => {
    if (!npmData[name].repository) return null;
    if (!githubRepoPattern.test(npmData[name].repository.url)) return null;
    const [ , owner, repo ] = githubRepoPattern.exec(npmData[name].repository.url);
    return { ...acc, [name]: { owner, repo } };
  }, {});
