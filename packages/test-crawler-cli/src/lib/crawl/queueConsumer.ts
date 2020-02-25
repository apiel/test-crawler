import { info, warn } from 'logol';
import { readdir, readJSON, move, pathExists, mkdirp } from 'fs-extra';
import { join } from 'path';
import {
    CONSUMER_COUNT,
    PROJECT_FOLDER,
    CrawlTarget,
    Browser,
    Project,
    CONSUME_TIMEOUT,
} from 'test-crawler-core';

import { loadPage } from './crawlPage';
import {
    pathQueueFolder,
    pathInfoFile,
    pathCrawlFolder,
    pathProjectFile,
} from '../path';

interface ToCrawl {
    projectId: string;
    id: any;
    url: any;
    timestamp: string;
}

let consumerRunning = 0;
let consumerMaxCount = CONSUMER_COUNT;

// some browser support only one instance at once
export async function setConsumerMaxCount({ projectId }: CrawlTarget) {
    const {
        crawlerInput: { browser },
    }: Project = await readJSON(pathProjectFile(projectId));
    if (
        browser === Browser.IeSelenium ||
        // || browser === Browser.EdgeSelenium
        browser === Browser.SafariSelenium
    ) {
        consumerMaxCount = 1;
    }
    info('Max consumer', consumerMaxCount);
}

function getConsumerMaxCount() {
    return consumerMaxCount;
}

async function pickFromQueue(
    projectId: string,
    timestamp: string,
): Promise<ToCrawl> {
    const queueFolder = pathQueueFolder(projectId, timestamp);
    if (await pathExists(queueFolder)) {
        const [file] = await readdir(queueFolder);
        if (file) {
            info('Crawl', file);
            try {
                const queueFile = join(queueFolder, file);
                const { id, url } = await readJSON(queueFile);
                await move(queueFile, pathInfoFile(projectId, timestamp, id));
                return { projectId, id, url, timestamp };
            } catch (error) {
                warn('Crawl possible error', error);
            }
        }
    }
}

async function pickFromQueues(): Promise<ToCrawl> {
    const projectFolders = await readdir(PROJECT_FOLDER);
    for (const projectId of projectFolders) {
        const crawlFolder = pathCrawlFolder(projectId);
        await mkdirp(crawlFolder);
        const timestampFolders = await readdir(crawlFolder);
        for (const timestamp of timestampFolders) {
            const toCrawl = await pickFromQueue(projectId, timestamp);
            if (toCrawl) {
                return toCrawl;
            }
        }
    }
}

let consumerIsRunning = false;
let consumeQueuesRetry = 0;

export function runQueuesConsumer(
    crawlTarget: CrawlTarget,
) {
    if (!consumerIsRunning) {
        consumeQueuesRetry = 0;
        consumeQueues(crawlTarget);
    }
}

async function consumeQueues(crawlTarget: CrawlTarget) {
    consumerIsRunning = true;
    if (consumerRunning < getConsumerMaxCount() && await consumeQueue(crawlTarget)) {
        consumeQueuesRetry = 0;
        consumeQueues(crawlTarget);
    } else if (!CONSUME_TIMEOUT || consumeQueuesRetry < CONSUME_TIMEOUT) {
        if (consumerRunning < getConsumerMaxCount()) {
            consumeQueuesRetry++;
        }
        setTimeout(() => consumeQueues(crawlTarget), 500);
    } else {
        consumerIsRunning = false;
        info('consumeQueues timeout');
    }
}

export function isQueuesConsumerRunning() {
    return consumerIsRunning;
}

async function consumeQueue(crawlTarget: CrawlTarget) {
    let toCrawl: ToCrawl;
    if (crawlTarget) {
        toCrawl = await pickFromQueue(
            crawlTarget.projectId,
            crawlTarget.timestamp,
        );
    } else {
        toCrawl = await pickFromQueues();
    }
    // console.log('toCrawl', toCrawl);
    if (toCrawl) {
        const { projectId, id, url, timestamp } = toCrawl;
        consumerRunning++;
        loadPage(projectId, id, url, timestamp, () => consumerRunning--);
        return true;
    }
    return false;
}
