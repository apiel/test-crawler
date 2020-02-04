import { join } from 'path';

// Need to implement env variable
export const PROJECT_FOLDER = process.env.PROJECT_FOLDER || join(__dirname, '../../../pages');
export const CRAWL_FOLDER = 'crawl';
export const PIN_FOLDER = 'pin';
export const CODE_FOLDER = 'code';
export const MAX_HISTORY = 10;
export const TIMEOUT = 10000; // 10 sec
export const CONSUMER_COUNT = 5;
export const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
export const CONSUME_TIMEOUT = process.env.CONSUME_TIMEOUT ? parseInt(process.env.CONSUME_TIMEOUT, 10) : 0;
