// NOTE: to change npm registry use NPM_CONFIG_REGISTRY=http://localhost env var

export const API_URL = process.env.API_URL;
export const RABBIT_ENDPOINT = process.env.RABBIT_ENDPOINT || 'amqp://localhost';
export const QUEUE_NAME = process.env.QUEUE_NAME || 'tasks-dev';
export const DEAD_LETTER_EXCHANGE_NAME = `${QUEUE_NAME}.exchange.dead`;
export const EXIT_TIMEOUT = process.env.EXIT_TIMEOUT ? Number(process.env.EXIT_TIMEOUT) : 2000;
export const REGION = process.env.REGION || 'eu-central-1';
export const COMPLETE_LAMBDA_NAME = process.env.COMPLETE_LAMBDA_NAME || 'Complete-dev';
export const COMPLETE_ENDPOINT = process.env.COMPLETE_ENDPOINT || 'complete';
export const CACHE_LAMBDA_NAME = process.env.CACHE_LAMBDA_NAME || 'GetModuleMeta-dev';
export const CACHE_ENDPOINT = process.env.CACHE_ENDPOINT || 'getmodulemeta';
export const PROGRESS_LAMBDA_NAME = process.env.PROGRESS_LAMBDA_NAME || 'Progress-dev';
export const PROGRESS_ENDPOINT = process.env.PROGRESS_ENDPOINT || 'progress';
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'corp-check-rest-filestorage-dev';
export const NPM_COUCHDB_ENDPOINT = process.env.NPM_COUCHDB_ENDPOINT || 'https://replicate.npmjs.com';
export const NPM_SEARCH_ENDPOINT = process.env.NPM_SEARCH_ENDPOINT || 'https://registry.npmjs.org/-/v1/search';

export const CWD = process.cwd();
export const JOB_FOLDER = 'job';
export const RESULT_FILE = 'result.json';

export const packageName = /^[^.@]*$/;
export const scope = /^@[^.@]*$/;
export const s3Pattern = /^s3:\/\/(.+)$/;
