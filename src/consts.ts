export const REGION = process.env.REGION || 'eu-central-1';
export const COMPLETE_LAMBDA_NAME = process.env.COMPLETE_LAMBDA_NAME || 'Complete-dev';
export const CACHE_LAMBDA_NAME = process.env.CACHE_LAMBDA_NAME || 'GetModuleMeta-dev';
export const CWD = process.cwd();
export const JOB_FOLDER = 'job';
export const RESULT_FILE = 'result.json';

export const packageName = /^[^.@]*$/;
export const scope = /^@[^.@]*$/;
export const fullPackageName = /^((@([^@]+)\/)?([^@]+))(@(.*))?$/;