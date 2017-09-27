import { Meta } from '../types';
import { CACHE_LAMBDA_NAME } from '../consts';
import invokeLambda from './invokeLambda';

export default (modules: string[]): Promise<Meta> => invokeLambda(CACHE_LAMBDA_NAME, { modules });
