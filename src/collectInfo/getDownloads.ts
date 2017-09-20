import request = require('request-promise-native');
import { TimeSeries } from '../types';

const prepareDownloads = (data: { downloads: number; day: string }[]): TimeSeries<number> =>
  data.map(({ downloads, day }) => ({ time: Date.parse(day), value: downloads }));

export default async (packageList: string[]): Promise<TimeSeries<number>[]> => {
  if (packageList.length === 0) return [];
  const response = await request.get(`https://api.npmjs.org/downloads/range/last-month/${packageList.join(',')}`, {
    json: true
  });
  if (packageList.length === 1) {
    return [ prepareDownloads(response.downloads) ];
  } else {
    return packageList.map(name => prepareDownloads(response[name].downloads));
  }
};
