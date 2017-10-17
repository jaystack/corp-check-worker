import { Result } from 'corp-check-core';
import { COMPLETE_LAMBDA_NAME } from '../../consts';
import invokeLambda from '../invokeLambda';

export default (cid: string, data: Result) => invokeLambda(COMPLETE_LAMBDA_NAME, { cid, ...data });
