import {
    pathExists,
    outputJSON,
    readFile,
    outputFile,
    mkdirp,
    readJSON,
} from 'fs-extra';

import { Crawler, CrawlerInput, CrawlTarget, CrawlerMethod, Viewport } from '../typing';
import Axios from 'axios';
import md5 = require('md5');
import {
    pathInfoFile,
    pathQueueFile,
    pathSiblingFile,
    pathCrawlerFile,
    pathSnapshotFolder,
    pathProjectFile,
} from '../path';

export async function startCrawler({ projectId, timestamp }: CrawlTarget) {
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
        urls.map((url: string) =>
            addToQueue(url, crawlerInput.viewport, projectId, timestamp),
        ),
    );
}

async function startSpiderBotCrawling(
    { url, viewport, limit }: CrawlerInput,
    projectId: string,
    timestamp: string,
) {
    const addedToqueue = await addToQueue(
        url,
        viewport,
        projectId,
        timestamp,
        limit,
    );
    if (!addedToqueue) {
        throw new Error('Something went wrong while adding job to queue');
    }
}

export async function addToQueue(
    url: string,
    viewport: Viewport,
    projectId: string,
    timestamp: string,
    limit: number = 0,
): Promise<boolean> {
    const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
    const id = md5(`${cleanUrl}-${JSON.stringify(viewport)}`);
    const resultFile = pathInfoFile(projectId, timestamp, id);
    const queueFile = pathQueueFile(projectId, timestamp, id);

    if (!(await pathExists(queueFile)) && !(await pathExists(resultFile))) {
        if (
            !limit ||
            (await updateSiblingCount(cleanUrl, projectId, timestamp)) < limit
        ) {
            await outputJSON(queueFile, { url: cleanUrl, id }, { spaces: 4 });
        }
        return true;
    }
    return false;
}

// this is for the limit in spider bot
async function updateSiblingCount(
    url: string,
    projectId: string,
    timestamp: string,
) {
    const urlPaths = url.split('/').filter(s => s);
    urlPaths.pop();
    const id = md5(urlPaths.join('/'));
    const file = pathSiblingFile(projectId, timestamp, id);
    let count = 0;
    if (await pathExists(file)) {
        count = parseInt((await readFile(file)).toString(), 10) + 1;
    }
    await outputFile(file, count);
    return count;
}
