import request = require('request-promise-native');
import { TimeSeries } from '../types';
import { getIssueFrequency } from './frequency';

export type GithubData = {
  starsCount: number;
  forksCount: number;
  subscribersCount: number;
  commitFrequency: TimeSeries<number>;
  codeFrequency: TimeSeries<number>;
  issueFrequency: TimeSeries<{ all: number; open: number }>;
}[];

const fetch = (owner: string, repo: string, endpoint: string = '', query?: Object) =>
  request.get(`https://api.github.com/repos/${owner}/${repo}${endpoint}`, {
    json: true,
    headers: { 'User-Agent': 'corp-check' },
    qs: query
  });

export default async (repositories: { owner: string; repo: string }[]): Promise<GithubData> => {
  const data = [];
  for (const repository of repositories) {
    if (!repository) continue;
    const { owner, repo } = repository;
    const { stargazers_count, subscribers_count, forks_count } = await fetch(owner, repo);
    const issues = await fetch(owner, repo, '/issues', { state: 'all', per_page: 10000 });
    data.push({
      starsCount: stargazers_count,
      forksCount: forks_count,
      subscribersCount: subscribers_count,
      issueFrequency: getIssueFrequency(issues)
    });
  }
  return data;
};
