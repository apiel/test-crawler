import { info } from 'logol';
import { readdir, readJSON, writeJSON, pathExists } from 'fs-extra';
import { extname } from 'path';
import { Crawler, CONSUME_TIMEOUT } from 'test-crawler-core';

import { afterAll } from '.';
import { pathCrawlerFile, pathQueueFolder, pathResultFolder } from '../path';
import { isQueuesConsumerRunning } from './queueConsumer';

interface ResultQueue {
    result?: {
        diffZoneCount: number;
    };
    projectId: string;
    timestamp: string;
    isError?: boolean;
}

let totalDiff = 0;
let totalError = 0;
let consumeResultRetry = 0;
let consumerIsRunning = false;
const resultsQueue: ResultQueue[] = [];

export function pushToResultConsumer(
    resultQueue: ResultQueue,
    push?: (payload: any) => void,
) {
    resultsQueue.push(resultQueue);
    runResultsConsumer(push);
}

// push should be shared differently
// maybe not even there, but more like a central place to subscrib
// so even multiple push could subscrib
// we would need to check that push connection is still alive
// pushToResultConsumer is never using push params
export function runResultsConsumer(push?: (payload: any) => void) {
    if (!consumerIsRunning) {
        consumerIsRunning = true;
        info('start result consumer');
        consumeResultRetry = 0;
        consumeResults(push);
    }
}

async function consumeResults(push?: (payload: any) => void) {
    // console.log('resultsQueue.length', resultsQueue.length, consumeResultRetry, consumeTimeout);
    if (await consumeResult(push)) {
        consumeResultRetry = 0;
        consumeResults(push);
    } else if (!CONSUME_TIMEOUT || consumeResultRetry < CONSUME_TIMEOUT) {
        consumeResultRetry++;
        setTimeout(() => consumeResults(push), 1000);
    } else {
        consumerIsRunning = false;
        info('consumeResults timeout');

        // this might be wrong?
        if (!isQueuesConsumerRunning()) {
            afterAll(totalDiff, totalError);
        }
    }
}

async function consumeResult(push?: (payload: any) => void) {
    if (resultsQueue.length) {
        const [{ projectId, timestamp, result, isError }] = resultsQueue.splice(
            0,
            1,
        );
        const crawlerFile = pathCrawlerFile(projectId, timestamp);
        const crawler: Crawler = await readJSON(crawlerFile);
        if (result) {
            crawler.diffZoneCount += result.diffZoneCount;
            totalDiff += result.diffZoneCount;
        }
        if (isError) {
            crawler.errorCount++;
            totalError++;
        }

        const queueFolder = pathQueueFolder(projectId, timestamp);
        const filesInQueue = (await pathExists(queueFolder))
            ? await readdir(queueFolder)
            : [];
        crawler.inQueue = filesInQueue.length;
        crawler.urlsCount = (
            await readdir(pathResultFolder(projectId, timestamp))
        ).filter(f => extname(f) === '.json' && f !== '_.json').length;
        crawler.lastUpdate = Date.now();

        await writeJSON(crawlerFile, crawler, { spaces: 4 });
        push && push(crawler);
        return true;
    }
    return false;
}
