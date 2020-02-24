import { join } from 'path';
import { ROOT_FOLDER } from 'test-crawler-core';

export const config = getConfig();

function getConfig(): Config {
    const configFile = join(ROOT_FOLDER, 'test-crawler.config.js');
    let config: any;
    try {
        config = require(configFile);
    }
    catch (e) {
        config = {};
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
    defaultRepo: string; // for the moment only single repo suported but we might want to make it on any repo
}
