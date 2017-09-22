import request = require('request-promise-native');
import { GithubData } from '../types';
import getGithubIssueStats = require('gh-issues-stats');

const TOKEN = '5907a5849829f615a5004fbb362351f3a7897511';

const fetch = (owner: string, repo: string, endpoint: string = '', query?: Object) =>
  request.get(`https://api.github.com/repos/${owner}/${repo}${endpoint}`, {
    json: true,
    headers: { 'User-Agent': 'corp-check', Authorization: `token ${TOKEN}` },
    qs: query
  });

export default async (repositories: { owner: string; repo: string }[]): Promise<GithubData[]> => {
  const data: GithubData[] = [];
  for (const repository of repositories) {
    if (!repository) continue;
    const { owner, repo } = repository;
    const { stargazers_count, subscribers_count, forks_count } = await fetch(owner, repo);
    const issueStats = await getGithubIssueStats(`${owner}/${repo}`, { tokens: [ TOKEN ] });
    data.push({
      starsCount: stargazers_count,
      forksCount: forks_count,
      subscribersCount: subscribers_count,
      ...issueStats
    } as GithubData);
  }
  return data;
};
