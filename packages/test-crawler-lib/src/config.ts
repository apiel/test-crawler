import { join } from 'path';

// Need to implement env variable
export const PAGES_FOLDER = process.env.PAGES_FOLDER || join(__dirname, '../pages');
export const CRAWL_FOLDER = join(PAGES_FOLDER, 'crawl');
export const PRESET_FOLDER = join(PAGES_FOLDER, 'preset');
export const BASE_FOLDER = join(PAGES_FOLDER, 'base');
export const CODE_FOLDER = join(PAGES_FOLDER, 'code');
export const MAX_HISTORY = 4;
export const TIMEOUT = 10000; // 10 sec
export const CONSUMER_COUNT = 5;
export const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
export const PROCESS_TIMEOUT = process.env.PROCESS_TIMEOUT ? parseInt(process.env.PROCESS_TIMEOUT, 10) : 0;
