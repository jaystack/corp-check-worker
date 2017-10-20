export const API_URL = process.env.API_URL || 'http://localhost:3001';
export const RABBIT_ENDPOINT = process.env.RABBIT_ENDPOINT || 'amqp://localhost';
export const QUEUE_NAME = process.env.QUEUE_NAME || 'tasks-dev';
export const EXIT_TIMEOUT = process.env.EXIT_TIMEOUT ? Number(process.env.EXIT_TIMEOUT) : 2000;
export const REGION = process.env.REGION || 'eu-central-1';
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'corp-check-rest-filestorage-dev';
export const CWD = process.cwd();
export const JOB_FOLDER = 'job';
export const RESULT_FILE = 'result.json';

export const packageName = /^[^.@]*$/;
export const scope = /^@[^.@]*$/;
export const s3Pattern = /^s3:\/\/(.+)$/;
