interface Config {
    BASE_URL: string;
    PAGES_FOLDER: string;
    CRAWL_FOLDER: string;
    BASE_FOLDER: string;
    MAX_HISTORY: number;
    TIMEOUT: number;
    CONSUMER_COUNT: number;
    USER_AGENT: string;
}

// need to search for crawler.config in parent file
export const config: Config = require('../../../crawler.config'); // tslint:disable-line
