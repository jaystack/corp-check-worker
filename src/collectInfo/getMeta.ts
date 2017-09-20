import { Meta } from '../types';

export default async (packageList: string[]): Promise<Meta> => {
  return packageList.reduce((meta, name) => ({ ...meta, [name]: {} }), {});
  /* try {
    const stats = await request({
      method: 'POST',
      uri: 'https://api.npms.io/v2/package/mget',
      json: true,
      body: packageList,
      timeout: 5000
    });
    Object.values(stats).forEach(({ collected: { metadata, github } }) => {
      if (metadata) delete metadata.maintainers;
      if (metadata) delete metadata.readme;
      if (github) delete github.contributors;
    });
    return stats;
  } catch (error) {
    console.error(error);
    return {};
  } */
};
