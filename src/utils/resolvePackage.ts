import { PackageSignature } from '../types';
import { fullPackageName, s3Pattern, REGION, S3_BUCKET_NAME } from '../consts';
import resolveJson from './resolveJson';

const resolvePackageSignature = (sign: string): PackageSignature => {
  if (!fullPackageName.test(sign)) {
    return {};
  } else {
    const [ signature, fullName, rawScope, scope, name, rawVersion, version ] = fullPackageName.exec(sign);
    return { signature, fullName, rawScope, scope, name, rawVersion, version };
  }
};

export default async (pkgOrJson: string): Promise<PackageSignature & { json?: string }> => {
  const json = await resolveJson(pkgOrJson);
  return json ? { json } : resolvePackageSignature(pkgOrJson);
};
