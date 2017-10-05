import { PackageSignature } from '../types';
import { fullPackageName, s3Pattern, REGION, S3_BUCKET_NAME } from '../consts';
import { resolveS3Key, fetchFromS3 } from '../aws/s3';

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
