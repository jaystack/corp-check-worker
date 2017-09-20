import { Assignment } from '../types';

export default (bulkInfo: any[]): Assignment<number>[] =>
  bulkInfo.map(({ time }) => Object.keys(time).reduce((acc, key) => ({ ...acc, [key]: Date.parse(time[key]) }), {}));
