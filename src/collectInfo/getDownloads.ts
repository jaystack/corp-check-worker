import request = require('request-promise-native');
import { TimeSeries, Registry } from '../types';
import { scope as scopePattern } from '../patterns';
import runSeries from '../runSeries';

const filterPackages = (predicate: (name: string) => boolean) => (packageList: string[]) =>
  packageList.filter(predicate);

const getScopedPackages = filterPackages(name => scopePattern.test(name));
const getRegularPackages = filterPackages(name => !scopePattern.test(name));

const getBulkDownloads = async (packageList: string[]): Promise<{ name: string; downloads: TimeSeries<number> }[]> => {
  const response = await request.get(`https://api.npmjs.org/downloads/range/last-month/${packageList.join(',')}`, {
    json: true
  });
  return packageList.length === 1
    ? [ prepareDownloads(packageList[0], response.downloads) ]
    : packageList.map(name => prepareDownloads(name, (response[name] || {}).downloads));
};

const getDownloads = async (name: string): Promise<{ name: string; downloads: TimeSeries<number> }> => {
  const response = await request.get(`https://api.npmjs.org/downloads/range/last-month/${name}`, {
    json: true
  });
  return prepareDownloads(name, response.downloads);
};

const prepareDownloads = (
  name: string,
  data: { downloads: number; day: string }[]
): { name: string; downloads: TimeSeries<number> } => ({
  name,
  downloads: data ? data.map(({ downloads, day }) => ({ time: Date.parse(day), value: downloads })) : null
});

const sortByOriginalIndex = (packageList: string[]) => ({ name: aName }, { name: bName }) => {
  const aIndex = packageList.findIndex(name => name === aName);
  const bIndex = packageList.findIndex(name => name === bName);
  return aIndex - bIndex;
};

export default async (packageList: string[]): Promise<Registry<TimeSeries<number>>> => {
  if (packageList.length === 0) return {};
  const regularPackages = getRegularPackages(packageList);
  const scopedPackages = getScopedPackages(packageList);
  const bulkDownloads = await getBulkDownloads(regularPackages);
  const scopedDownloads = await runSeries(scopedPackages.map(name => getDownloads.bind(null, name)));
  return [ ...bulkDownloads, ...scopedDownloads ].reduce((acc, curr) => ({ ...acc, [curr.name]: curr.downloads }), {});
};
