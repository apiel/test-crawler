import { join } from 'path';
import Cookies from 'universal-cookie';

export const ROOT_FOLDER = process.env.ROOT_FOLDER || join(__dirname, '../../..');
export const PROJECT_FOLDER = process.env.PROJECT_FOLDER || 'test-crawler';
export const CRAWL_FOLDER = 'crawl';
export const PIN_FOLDER = 'pin';
export const CODE_FOLDER = 'code';
export const MAX_HISTORY = 10;
export const TIMEOUT = 10000; // 10 sec
export const CONSUMER_COUNT = 5;
export const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
export const CONSUME_TIMEOUT = process.env.CONSUME_TIMEOUT ? parseInt(process.env.CONSUME_TIMEOUT, 10) : 0;

export const config = getConfig();

function getConfig(): Config {
    const configFile = join(ROOT_FOLDER, 'test-crawler.config.js');
    let config: any;
    try {
        config = require(configFile);
    }
    catch (e) {
        try {
            const cookies = new Cookies();
            config = {
                remote: {
                    github: cookies.get('github'),
                }
            };
        }
        catch (e) {
            config = {};
        }
    }
    return {
        remote: {},
        ...config,
    }
}

export interface Config {
    remote: {
        github?: GitHubConfig,
    }
}

export interface GitHubConfig {
    user: string;
    token: string;
    repo: string; // for the moment only single repo suported but we might want to make it on any repo
}
