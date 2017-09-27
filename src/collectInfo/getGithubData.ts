import request = require('request-promise-native');
import { GithubData, TimeSeries, Registry } from '../types';
import getGithubIssueStats = require('gh-issues-stats');
import runSeries from '../runSeries';

const TOKEN = '5907a5849829f615a5004fbb362351f3a7897511';

const fetch = (owner: string, repo: string, endpoint: string = '', query?: Object) =>
  request.get(`https://api.github.com/repos/${owner}/${repo}${endpoint}`, {
    json: true,
    headers: { 'User-Agent': 'corp-check', Authorization: `token ${TOKEN}` },
    qs: query
  });

const prepareCommitFrequency = (commitFrequency: { total: number; week: number }[]): TimeSeries<number> =>
  Array.isArray(commitFrequency)
    ? commitFrequency.map(({ total, week }) => ({ time: week * 1000, value: total }))
    : null;

const prepareCodeFrequency = (codeFrequency: [number, number, number][]): TimeSeries<[number, number]> =>
  Array.isArray(codeFrequency)
    ? codeFrequency.map(([ week, ...value ]) => ({ time: week * 1000, value: <[number, number]>value }))
    : null;

const getGithubData = async (repository: { owner: string; repo: string }): Promise<GithubData> => {
  if (!repository) return {} as GithubData;
  const { owner, repo } = repository;
  const { stargazers_count, subscribers_count, forks_count } = await fetch(owner, repo);
  const commitFrequency = await fetch(owner, repo, '/stats/commit_activity');
  const codeFrequency = await fetch(owner, repo, '/stats/code_frequency');
  //const issueStats = await getGithubIssueStats(`${owner}/${repo}`, { tokens: [ TOKEN ] });
  return {
    starsCount: stargazers_count,
    forksCount: forks_count,
    subscribersCount: subscribers_count,
    commitFrequency: prepareCommitFrequency(commitFrequency),
    codeFrequency: prepareCodeFrequency(codeFrequency)
    //...issueStats
  } as GithubData;
};

export default async (repositories: Registry<{ owner: string; repo: string }>): Promise<Registry<GithubData>> =>
  runSeries(Object.keys(repositories).map(name => getGithubData.bind(null, repositories[name]))).then(bulkGithubData =>
    Object.keys(repositories).reduce((acc, name, i) => ({ ...acc, [name]: bulkGithubData[i] }), {})
  );
