import { Info } from 'corp-check-core';
import { stringify } from 'querystring';
import request = require('request-promise-native');
import { API_URL } from './consts';

const invoke = (method: string) => (endpoint: string, { query, body }: { query?: Object; body?: any } = {}) =>
  request(`${API_URL}/${endpoint}`, { json: true, method, body, query });

const api = {
  get: invoke('GET'),
  post: invoke('POST'),
  put: invoke('PUT'),
  patch: invoke('PATCH'),
  delete: invoke('DELETE')
};

export const complete = (cid: string, data: Info) => api.post('complete', { body: { cid, data } });

export const completeWithError = (cid: string, error: string) => api.post('complete', { body: { cid, error } });

export const getCache = (modules: string[]) => api.post('getmodulemeta', { body: { modules } });
