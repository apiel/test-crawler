import { info } from 'logol';
import { readdir, readJSON, writeJSON, pathExists } from 'fs-extra';
import { join, extname } from 'path';

import { Crawler } from '../../typing';
import { afterAll } from '.';
import { QUEUE_FOLDER } from '../config';

interface ResultQueue {
    result?: {
        diffZoneCount: number,
    };
    folder: string;
    isError?: boolean;
}

let totalDiff = 0;
let totalError = 0;
const resultsQueue: ResultQueue[] = [];

export function pushToResultConsumer(resultQueue: ResultQueue) {
    resultsQueue.push(resultQueue);
}

let consumeResultRetry = 0;

export function initConsumeResults (consumeTimeout: number, push?: (payload: any) => void) {
    consumeResultRetry = 0;
    return consumeResults(consumeTimeout, push);
}

async function consumeResults(consumeTimeout: number, push?: (payload: any) => void) {
    // console.log('resultsQueue.length', resultsQueue.length, consumeResultRetry, consumeTimeout);
    if (resultsQueue.length) {
        consumeResultRetry = 0;
        const [{ folder, result, isError }] = resultsQueue.splice(0, 1);
        const file = join(folder, '_.json');
        const crawler: Crawler = await readJSON(file);
        if (result) {
            crawler.diffZoneCount += result.diffZoneCount;
            totalDiff += result.diffZoneCount;
        }
        if (isError) {
            crawler.errorCount++;
            totalError++;
        }

        const queueFolder = join(folder, QUEUE_FOLDER);
        const filesInQueue = await pathExists(queueFolder) ? await readdir(queueFolder) : [];
        crawler.inQueue = filesInQueue.length;
        crawler.urlsCount = (await readdir(folder)).filter(f => extname(f) === '.json' && f !== '_.json').length;
        crawler.lastUpdate = Date.now();

        await writeJSON(file, crawler, { spaces: 4 });
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
