import request = require('request-promise-native');
import sleep from '../sleep';
import runSeries from '../runSeries';

const getDependentCount = async (name: string): Promise<number> => {
  try {
    const {
      rows: [ { value } ]
    } = await request.get(`https://replicate.npmjs.com/registry/_design/app/_view/dependedUpon`, {
      json: true,
      qs: {
        group_level: 1,
        start_key: `["${name}"]`,
        end_key: `["${name}", {}]`
      }
    });
    return value;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default (packageList: string[]): Promise<number[]> =>
  runSeries(packageList.map(name => getDependentCount.bind(null, name)));
