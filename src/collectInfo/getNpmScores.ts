import { stringify } from 'querystring';
import request = require('request-promise-native');
import { NpmScores } from 'corp-check-core';
import runParallel from '../utils/runParallel';

const PARALLEL_LIMIT = 3;

const getNpmScores = async (packageName: string): Promise<NpmScores> => {
  console.log('GET NPM SCORE OF', packageName);
  const { objects } = await request
    .get(`https://registry.npmjs.org/-/v1/search?${stringify({ text: packageName, size: 5 })}`, {
      json: true
    })
    .catch(err => ({ objects: [] }));
  const result = objects.find(({ package: { name } }) => name === packageName);
  return result && result.score && result.score.detail ? result.score.detail : {};
};

export default (packageList: string[]) =>
  runParallel(packageList.map(name => getNpmScores.bind(null, name)), PARALLEL_LIMIT).then(scores =>
    scores.reduce((acc, item, i) => ({ ...acc, [packageList[i]]: item }), {})
  );
