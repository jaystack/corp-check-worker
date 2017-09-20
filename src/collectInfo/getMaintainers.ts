export default (bulkInfo: any[]): number[] => bulkInfo.map(({ maintainers }) => maintainers.length);
