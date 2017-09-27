export default async (functions: Function[]) => {
  const results = [];
  for (const func of functions) results.push(await func());
  return results;
};
