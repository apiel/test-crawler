import { resolve } from 'path';

export const ROOT_FOLDER = resolve(process.env.ROOT_FOLDER) || process.cwd();
export const PROJECT_FOLDER = process.env.PROJECT_FOLDER || 'test-crawler';
export const CRAWL_FOLDER = 'crawl';
export const PIN_FOLDER = 'pin';
export const CODE_FOLDER = 'code';
export const QUEUE_FOLDER = 'queue';
export const SNAPSHOT_FOLDER = 'snapshot';
export const MAX_HISTORY = 10;
export const TIMEOUT = 10000; // 10 sec
export const CONSUMER_COUNT = 5;
export const USER_AGENT =
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
export const CONSUME_TIMEOUT = process.env.CONSUME_TIMEOUT
    ? parseInt(process.env.CONSUME_TIMEOUT, 10)
    : 0;
