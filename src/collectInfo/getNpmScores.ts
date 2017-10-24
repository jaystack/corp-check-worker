import { NpmScores } from 'corp-check-core';
import { npmSearch } from '../side-effects/npm';
import runParallel from '../utils/runParallel';

const PARALLEL_LIMIT = 3;

const getNpmScores = async (packageName: string): Promise<NpmScores> => {
  console.log('GET NPM SCORE OF', packageName);
  const results = await npmSearch(packageName, 5);
  const result = results.find(({ package: { name } }) => name === packageName);
  return result && result.score && result.score.detail ? result.score.detail : {};
};

export default (packageList: string[]) =>
  runParallel(packageList.map(name => getNpmScores.bind(null, name)), PARALLEL_LIMIT).then(scores =>
    scores.reduce((acc, item, i) => ({ ...acc, [packageList[i]]: item }), {})
  );
