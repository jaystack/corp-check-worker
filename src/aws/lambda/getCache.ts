import { Meta } from 'corp-check-core';
import { CACHE_LAMBDA_NAME } from '../../consts';
import invokeLambda from '../invokeLambda';

export default (modules: string[]): Promise<Meta> => invokeLambda(CACHE_LAMBDA_NAME, { modules });
