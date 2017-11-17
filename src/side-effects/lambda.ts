import { Result, PackageMeta } from 'corp-check-core';
import { Lambda } from 'aws-sdk';
import { stringify } from 'querystring';
import request = require('request-promise-native');
import {
  REGION,
  API_URL,
  COMPLETE_LAMBDA_NAME,
  COMPLETE_ENDPOINT,
  CACHE_LAMBDA_NAME,
  CACHE_ENDPOINT,
  PROGRESS_LAMBDA_NAME,
  PROGRESS_ENDPOINT
} from '../consts';

const invokeLambda = <T>(functionName: string, payload: Object): Promise<T> =>
  new Promise((resolve, reject) =>
    new Lambda({ region: REGION }).invoke(
      { FunctionName: functionName, Payload: JSON.stringify(payload) },
      (err, result: { Payload: string }) => (err ? reject(err) : resolve(<T>JSON.parse(result.Payload)))
    )
  );

const invoke = (method: string) => (endpoint: string, { query, body }: { query?: Object; body?: any } = {}) =>
  request(`${API_URL}/${endpoint}`, { json: true, method, body, query });

const api = {
  get: invoke('GET'),
  post: invoke('POST'),
  put: invoke('PUT'),
  patch: invoke('PATCH'),
  delete: invoke('DELETE')
};

export const complete = (cid: string, payload: Result) =>
  API_URL
    ? api.post(COMPLETE_ENDPOINT, { body: { cid, ...payload } })
    : invokeLambda(COMPLETE_LAMBDA_NAME, { cid, ...payload });

export const getCache = (modules: string[]): Promise<PackageMeta[]> =>
  API_URL ? api.post(CACHE_ENDPOINT, { body: { modules } }) : invokeLambda(CACHE_LAMBDA_NAME, { modules });

export const updateProgress = (cid: string, message: string): Promise<void> =>
  (API_URL
    ? api.post(PROGRESS_ENDPOINT, { body: { cid, message } })
    : invokeLambda(PROGRESS_LAMBDA_NAME, { cid, message })).catch(error =>
    console.error('Erro via send progress status:', error)
  );
