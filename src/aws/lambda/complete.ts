import { Result } from 'corp-check-core';
import { API_URL, COMPLETE_LAMBDA_NAME, COMPLETE_ENDPOINT } from '../../consts';
import invokeLambda from '../invokeLambda';
import api from '../http';

export default (cid: string, payload: Result) =>
  API_URL
    ? api.post(COMPLETE_ENDPOINT, { body: { cid, ...payload } })
    : invokeLambda(COMPLETE_LAMBDA_NAME, { cid, ...payload });
