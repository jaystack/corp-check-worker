const packageNamePattern = /^(@[a-zA-Z0-9-]+\/)?([a-zA-Z0-9-]+)(@\d.\d.\d)?$/;

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
    if (!packageNamePattern.test(pkgOrJson)) {
      return { scope: null };
    } else {
      const [ , scope = '', name = '', version = '' ] = packageNamePattern.exec(pkgOrJson);
      return { scope, name, version };
    }
  }
};
