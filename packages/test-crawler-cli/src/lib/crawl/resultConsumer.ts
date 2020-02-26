import { readdir, readJSON, writeJSON, pathExists } from 'fs-extra';
import { extname } from 'path';
import { Crawler } from 'test-crawler-core';

import { pathCrawlerFile, pathQueueFolder, pathResultFolder } from '../path';
import { Consumer } from './consumer';
import { push } from './pusher';

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
const resultsQueue: ResultQueue[] = [];

export function pushToResultConsumer(resultQueue: ResultQueue) {
    resultsQueue.push(resultQueue);
}

const queue = { name: 'result', maxConcurrent: 1 };

export const consumer: Consumer = {
    finish: () => ({ totalDiff, totalError }),
    picker: async () => !!resultsQueue.length && ({
        data: resultsQueue[0],
        apply: async () => {
            resultsQueue.splice(0, 1);
        },
        queue,
    }),
    runner: async ({ projectId, timestamp, result, isError }: ResultQueue) => {
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
        push(crawler);
    },
};
