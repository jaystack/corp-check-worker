import getLicenseInfo = require('get-license-npm');

const stringifyLicenseType = (license: any): string => {
  if (!license) return null;
  if (typeof license === 'string') return license;
  return JSON.stringify(license);
};

export default async (folder: string) => {
  const license = await getLicenseInfo(folder);
  const licenseValue = license.license || null;
  const licenseType = (licenseValue && licenseValue.type) || licenseValue;
  return { type: stringifyLicenseType(licenseType), hasLicenseFile: !!license.licenseFile, isPrivate: !!license.private };
};
