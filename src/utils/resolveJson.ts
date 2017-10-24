export default (value: string): any => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};
