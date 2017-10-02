import { stringify } from 'querystring';
import request = require('request-promise-native');
import { NpmScores } from '../types';
import runSeries from '../utils/runSeries';

const getNpmScores = async (packageName: string): Promise<NpmScores> => {
  const { objects } = await request
    .get(`https://registry.npmjs.org/-/v1/search?${stringify({ text: packageName, size: 5 })}`, {
      json: true
    })
    .catch(err => ({ objects: [] }));
  const result = objects.find(({ package: { name } }) => name === packageName);
  return result.score.detail;
};

export default (packageList: string[]) =>
  runSeries(packageList.map(name => getNpmScores.bind(null, name))).then(scores =>
    scores.reduce((acc, item, i) => ({ ...acc, [packageList[i]]: item }), {})
  );
