import { Injectable } from '@nestjs/common';

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

@Injectable()
export class ConfigService {
    // here we should look in parent folder for crawler.config.js or crawler.config.json

    config: Config;

    constructor() {
        this.config = require('../../../../crawler.config');
    }
}
