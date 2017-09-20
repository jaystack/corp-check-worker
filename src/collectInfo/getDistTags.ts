import { Assignment } from '../types';

export default (bulkInfo: any[]): Assignment<string>[] => bulkInfo.map(({ 'dist-tags': tags }) => tags);
