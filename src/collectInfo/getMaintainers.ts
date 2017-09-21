export default (bulkInfo: any[]): number[] =>
  bulkInfo.map(({ maintainers }) => (maintainers ? maintainers.length : null));
