import { info } from 'logol';
import { readdir, readJSON, writeJSON, pathExists } from 'fs-extra';
import { extname } from 'path';
import { Crawler } from 'test-crawler-core';

import { afterAll } from '.';
import { pathCrawlerFile, pathQueueFolder, pathResultFolder } from '../path';

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
const resultsQueue: ResultQueue[] = [];

export function pushToResultConsumer(resultQueue: ResultQueue) {
    resultsQueue.push(resultQueue);
}

export function initConsumeResults(
    consumeTimeout: number,
    push?: (payload: any) => void,
) {
    consumeResultRetry = 0;
    return consumeResults(consumeTimeout, push);
}

async function consumeResults(
    consumeTimeout: number,
    push?: (payload: any) => void,
) {
    // console.log('resultsQueue.length', resultsQueue.length, consumeResultRetry, consumeTimeout);
    if (resultsQueue.length) {
        consumeResultRetry = 0;
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
        consumeResults(consumeTimeout, push);
    } else if (!consumeTimeout || consumeResultRetry < consumeTimeout) {
        consumeResultRetry++;
        setTimeout(() => consumeResults(consumeTimeout, push), 1000);
    } else {
        info('consumeResults timeout');
        afterAll(totalDiff, totalError);
    }
}
