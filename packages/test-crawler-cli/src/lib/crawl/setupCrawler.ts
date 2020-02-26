import {
    outputJSON,
    mkdirp,
    readJSON,
} from 'fs-extra';
import {
    Crawler,
    CrawlerInput,
    CrawlTarget,
    CrawlerMethod,
} from 'test-crawler-core';
import Axios from 'axios';
import md5 = require('md5');

import {
    pathCrawlerFile,
    pathSnapshotFolder,
    pathProjectFile,
} from '../path';
import { installDriver } from './browsers/browser';
import { pushToCrawl } from './crawlerConsumer';

export async function setupCrawler({ projectId, timestamp }: CrawlTarget) {
    const { crawlerInput } = await readJSON(pathProjectFile(projectId));

    const id = md5(
        `${timestamp}-${crawlerInput.url}-${JSON.stringify(
            crawlerInput.viewport,
        )}`,
    );

    await mkdirp(pathSnapshotFolder(projectId));

    const crawler: Crawler = {
        ...crawlerInput,
        timestamp,
        id,
        diffZoneCount: 0,
        errorCount: 0,
        status: 'review',
        inQueue: 1,
        urlsCount: 0,
        startAt: Date.now(),
        lastUpdate: Date.now(),
    };

    await installDriver(crawler.browser);

    await outputJSON(pathCrawlerFile(projectId, timestamp), crawler, {
        spaces: 4,
    });

    if (crawlerInput.method === CrawlerMethod.URLs) {
        await startUrlsCrawling(crawlerInput, projectId, timestamp);
    } else {
        await startSpiderBotCrawling(crawlerInput, projectId, timestamp);
    }
}

async function startUrlsCrawling(
    crawlerInput: CrawlerInput,
    projectId: string,
    timestamp: string,
) {
    const { data } = await Axios.get(crawlerInput.url);
    const urls = data.split(`\n`).filter((url: string) => url.trim());
    await Promise.all(
        urls.map((url: string) => pushToCrawl(url, projectId, timestamp)),
    );
}

async function startSpiderBotCrawling(
    { url, limit }: CrawlerInput,
    projectId: string,
    timestamp: string,
) {
    const addedToqueue = await pushToCrawl(url, projectId, timestamp, limit);
    if (!addedToqueue) {
        throw new Error('Something went wrong while adding job to queue');
    }
}
