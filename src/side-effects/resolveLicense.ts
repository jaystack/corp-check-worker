import getLicenseInfo = require('get-license-npm');

export default async (folder: string) => {
  const license = await getLicenseInfo(folder);
  const licenseValue = license.license || null;
  const licenseType = (licenseValue && licenseValue.type) || licenseValue;
  return { type: licenseType, hasLicenseFile: !!license.licenseFile, isPrivate: !!license.private };
};
