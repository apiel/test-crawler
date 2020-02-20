import { error, info } from 'logol';
import { readdir, pathExists, mkdirp } from 'fs-extra';
import { join } from 'path';

import {
    CRAWL_FOLDER,
    CONSUME_TIMEOUT,
    PROJECT_FOLDER,
    MAX_HISTORY,
    ROOT_FOLDER,
} from '../config';
import { CrawlTarget } from '../../typing';
import { promisify } from 'util';
import rimraf = require('rimraf');
import { initConsumeResults } from './resultConsumer';
import { setConsumerMaxCount, initConsumeQueues } from './queueConsumer';
import { startCrawler } from './startCrawler';

let projectIdForExit: string;

async function beforeAll(crawlTarget?: CrawlTarget) {
    if (crawlTarget) {
        try {
            projectIdForExit = crawlTarget.projectId;
            const jsFile = join(ROOT_FOLDER, PROJECT_FOLDER, crawlTarget.projectId, 'before.js');
            if (await pathExists(jsFile)) {
                const fn = require(jsFile);
                await fn();
            }
        } catch (err) {
            error('Something went wrong in beforeAll script', err);
        }
    }
}

export async function afterAll(totalDiff: number, totalError: number) {
    info('Done', { totalDiff, totalError });
    if (projectIdForExit) {
        try {
            const jsFile = join(ROOT_FOLDER, PROJECT_FOLDER, projectIdForExit, 'after.js');
            if (await pathExists(jsFile)) {
                const fn = require(jsFile);
                fn(totalDiff, totalError);
            }
        } catch (err) {
            error('Something went wrong in afterAll script', err);
        }
    }
}

async function prepareFolders() {
    if (!(await pathExists(PROJECT_FOLDER))) {
        await mkdirp(PROJECT_FOLDER);
    }
    return cleanHistory();
}

async function cleanHistory() {
    const projects = await readdir(PROJECT_FOLDER);
    for (const project of projects) {
        const crawlFolder = join(PROJECT_FOLDER, project, CRAWL_FOLDER);
        if (await pathExists(crawlFolder)) {
            const results = await readdir(crawlFolder);
            const cleanUp = results.slice(0, -(MAX_HISTORY - 1));
            for (const toRemove of cleanUp) {
                await promisify(rimraf)(join(crawlFolder, toRemove));
            }
        }
    }
}

export async function crawl(
    crawlTarget?: CrawlTarget,
    consumeTimeout = CONSUME_TIMEOUT,
    push?: (payload: any) => void,
) {
    await prepareFolders();
    await beforeAll(crawlTarget);
    await setConsumerMaxCount(crawlTarget);
    crawlTarget && startCrawler(crawlTarget);
    initConsumeResults(consumeTimeout, push);
    initConsumeQueues(consumeTimeout, crawlTarget);
}
