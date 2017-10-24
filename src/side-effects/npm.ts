import { stringify } from 'querystring';
import request = require('request-promise-native');

export const getPackages = (packageNames: string[]): any[] =>
  request
    .post('https://replicate.npmjs.com/registry/_all_docs', {
      json: true,
      body: { keys: packageNames }
    })
    .catch(err => ({ rows: [] }))
    .then(({ rows }) => rows);

export const search = (text: string, size: number): any[] =>
  request
    .get(`https://registry.npmjs.org/-/v1/search?${stringify({ text, size })}`, { json: true })
    .catch(err => ({ objects: [] }))
    .then(({ objects }) => objects);
