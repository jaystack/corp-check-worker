import { stringify } from 'querystring';
import { join } from 'path';
import request = require('request-promise-native');
import { NPM_COUCHDB_ENDPOINT, NPM_SEARCH_ENDPOINT } from '../consts';

export const getPackages = (packageNames: string[]): any[] =>
  packageNames.length === 0
    ? []
    : request
        .post(`${NPM_COUCHDB_ENDPOINT}/registry/_all_docs`, {
          json: true,
          body: { keys: packageNames }
        })
        .catch(err => ({ rows: [] }))
        .then(({ rows }) => rows);

export const search = (text: string, size: number): any[] =>
  request
    .get(`${NPM_SEARCH_ENDPOINT}?${stringify({ text, size })}`, { json: true })
    .catch(err => ({ objects: [] }))
    .then(({ objects }) => objects);
