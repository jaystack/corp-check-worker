import { Meta } from 'corp-check-core';
import { API_URL, CACHE_LAMBDA_NAME, CACHE_ENDPOINT } from '../consts';
import invokeLambda from '../side-effects/invokeLambda';
import api from '../side-effects/api';

export default (modules: string[]): Promise<Meta> =>
  API_URL ? api.post(CACHE_ENDPOINT, { body: { modules } }) : invokeLambda(CACHE_LAMBDA_NAME, { modules });
