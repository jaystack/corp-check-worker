const packageNamePattern = /^(@[a-zA-Z0-9-]+\/)?([a-zA-Z0-9-]+)(@\d.\d.\d)?$/;

export default (pkgOrJson: string) => {
  try {
    return { json: JSON.parse(pkgOrJson), scope: null, name: null, version: null };
  } catch (err) {
    if (!packageNamePattern.test(pkgOrJson)) {
      return { scope: null, name: null, version: null, json: null };
    } else {
      const [ , scope = '', name = '', version = '' ] = packageNamePattern.exec(pkgOrJson);
      return { scope, name, version, json: null };
    }
  }
};
