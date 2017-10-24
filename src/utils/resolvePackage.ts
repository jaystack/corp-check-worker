import { resolveNpmPackageName, PackageSignature } from 'corp-check-core';
import { s3Pattern, REGION, S3_BUCKET_NAME } from '../consts';
import resolveJson from './resolveJson';

export default (pkgOrJson: string): PackageSignature & { json?: string } => {
  const json = resolveJson(pkgOrJson);
  return json ? { json } : resolveNpmPackageName(pkgOrJson) || {};
};
