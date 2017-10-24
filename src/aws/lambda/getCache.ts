import { Meta } from 'corp-check-core';
import { API_URL, CACHE_LAMBDA_NAME, CACHE_ENDPOINT } from '../../consts';
import invokeLambda from '../invokeLambda';
import api from '../http';

export default (modules: string[]): Promise<Meta> =>
  API_URL ? api.post(CACHE_ENDPOINT, { body: { modules } }) : invokeLambda(CACHE_LAMBDA_NAME, { modules });
