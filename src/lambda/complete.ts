import { Result } from 'corp-check-core';
import { API_URL, COMPLETE_LAMBDA_NAME, COMPLETE_ENDPOINT } from '../consts';
import invokeLambda from '../side-effects/invokeLambda';
import api from '../side-effects/api';

export default (cid: string, payload: Result) =>
  API_URL
    ? api.post(COMPLETE_ENDPOINT, { body: { cid, ...payload } })
    : invokeLambda(COMPLETE_LAMBDA_NAME, { cid, ...payload });
