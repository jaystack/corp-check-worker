import { PackageSignature } from '../types';
import { fullPackageName } from '../consts';

const resolvePackageSignature = (sign: string): PackageSignature => {
  if (!fullPackageName.test(sign)) {
    return {};
  } else {
    const [ signature, fullName, rawScope, scope, name, rawVersion, version ] = fullPackageName.exec(sign);
    return { signature, fullName, rawScope, scope, name, rawVersion, version };
  }
};

export default (pkgOrJson: string): PackageSignature & { json?: string } => {
  try {
    return { json: JSON.parse(pkgOrJson) };
  } catch (err) {
    return resolvePackageSignature(pkgOrJson);
  }
};
