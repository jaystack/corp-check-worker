import { CACHE_LAMBDA_NAME } from '../consts';
import invokeLambda from '../invokeLambda';

export default (modules: string[]) => invokeLambda(CACHE_LAMBDA_NAME, { modules });
