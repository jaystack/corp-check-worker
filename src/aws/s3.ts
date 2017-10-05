import { S3 } from 'aws-sdk';
import { s3Pattern, REGION, S3_BUCKET_NAME } from '../consts';

export const fetchFromS3 = (key: string): Promise<any> =>
  new Promise((resolve, reject) =>
    new S3({ region: REGION }).getObject({ Bucket: S3_BUCKET_NAME, Key: key }, (err, res) => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(res.Body.toString()));
      } catch (error) {
        reject(new Error('Invalid JSON from S3'));
      }
    })
  );

export const resolveS3Key = (s3Signature: string): string => {
  if (!s3Pattern.test(s3Signature)) return null;
  const [ , key ] = s3Pattern.exec(s3Signature);
  return key;
};
