import { S3 } from 'aws-sdk';
import { parse } from 'url';
import { PackageSignature } from '../types';
import { fullPackageName, s3Pattern, REGION, S3_BUCKET_NAME } from '../consts';

const fetchFromS3 = (key: string): Promise<any> =>
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

const resolveS3Key = (value: string): string => {
  if (!s3Pattern.test(value)) return null;
  const [ , key ] = s3Pattern.exec(value);
  return key;
};

const resolvePackageSignature = (sign: string): PackageSignature => {
  if (!fullPackageName.test(sign)) {
    return {};
  } else {
    const [ signature, fullName, rawScope, scope, name, rawVersion, version ] = fullPackageName.exec(sign);
    return { signature, fullName, rawScope, scope, name, rawVersion, version };
  }
};

export default async (pkgOrJson: string): Promise<PackageSignature & { json?: string }> => {
  try {
    return { json: JSON.parse(pkgOrJson) };
  } catch (err) {
    const key = resolveS3Key(pkgOrJson);
    return key ? { json: await fetchFromS3(key) } : resolvePackageSignature(pkgOrJson);
  }
};
