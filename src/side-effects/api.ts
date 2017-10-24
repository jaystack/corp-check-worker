import { Result } from 'corp-check-core';
import { stringify } from 'querystring';
import request = require('request-promise-native');
import { API_URL } from '../consts';

const invoke = (method: string) => (endpoint: string, { query, body }: { query?: Object; body?: any } = {}) =>
  request(`${API_URL}/${endpoint}`, { json: true, method, body, query });

export default {
  get: invoke('GET'),
  post: invoke('POST'),
  put: invoke('PUT'),
  patch: invoke('PATCH'),
  delete: invoke('DELETE')
};
