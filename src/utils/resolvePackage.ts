import { resolveNpmPackageName, PackageSignature } from 'corp-check-core';
import { fullPackageName, s3Pattern, REGION, S3_BUCKET_NAME } from '../consts';
import resolveJson from './resolveJson';

export default async (pkgOrJson: string): Promise<PackageSignature & { json?: string }> => {
  const json = await resolveJson(pkgOrJson);
  return json ? { json } : resolveNpmPackageName(pkgOrJson) || {};
};
