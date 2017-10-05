import { resolveS3Key, fetchFromS3 } from '../aws/s3';

export default async (value: string): Promise<any> => {
  try {
    return JSON.parse(value);
  } catch (err) {
    const key = resolveS3Key(value);
    return key ? { json: await fetchFromS3(key) } : null;
  }
};
