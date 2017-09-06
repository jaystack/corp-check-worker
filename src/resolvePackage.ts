const packageNamePattern = /.+/; // TODO: determine pattern

export default (pkgOrJson: string) => {
  try {
    return { json: JSON.parse(pkgOrJson), name: null };
  } catch (err) {
    return packageNamePattern.test(pkgOrJson) ? { name: pkgOrJson, json: null } : { name: null, json: null };
  }
};
