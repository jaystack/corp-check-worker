import { fullPackageName } from './patterns';

export default (
  pkgOrJson: string
): {
  scope?: string;
  name?: string;
  version?: string;
  json?: string;
} => {
  try {
    return { json: JSON.parse(pkgOrJson) };
  } catch (err) {
    if (!fullPackageName.test(pkgOrJson)) {
      return { scope: null };
    } else {
      const [ , scope = '', name = '', version = '' ] = fullPackageName.exec(pkgOrJson);
      return { scope, name, version };
    }
  }
};
