import { Viewport } from 'puppeteer';
import { pathExists, outputJson, outputJSON, readFile, outputFile } from 'fs-extra';
import { join } from 'path';

import {
    CRAWL_FOLDER,
    PROJECT_FOLDER,
} from '../config';

import { CrawlerMethod } from '../index';
import { Crawler, CrawlerInput, CrawlTarget } from '../../typing';
import { CrawlerProvider } from '../CrawlerProvider';
import Axios from 'axios';
import md5 = require('md5');
import { StorageType } from '../../storage.typing';
import { getQueueFolder } from './utils';

export async function startCrawler({ projectId, pagesFolder }: CrawlTarget) {
    const crawlerProvider = new CrawlerProvider(StorageType.Local);
    const { crawlerInput } = await crawlerProvider.loadProject(projectId);

    const id = md5(`${pagesFolder}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);

    const crawler: Crawler = {
        ...crawlerInput,
        timestamp: pagesFolder,
        id,
        diffZoneCount: 0,
        errorCount: 0,
        status: 'review',
        inQueue: 1,
        urlsCount: 0,
        startAt: Date.now(),
        lastUpdate: Date.now(),
    };

    const distFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, pagesFolder);
    await outputJSON(join(distFolder, '_.json'), crawler, { spaces: 4 });

    if (crawlerInput.method === CrawlerMethod.URLs) {
        await startUrlsCrawling(crawlerInput, distFolder);
    } else {
        await startSpiderBotCrawling(crawlerInput, distFolder);
    }
}

async function startUrlsCrawling(crawlerInput: CrawlerInput, distFolder: string) {
    const { data } = await Axios.get(crawlerInput.url);
    const urls = data.split(`\n`).filter((url: string) => url.trim());
    await Promise.all(urls.map((url: string) =>
        addToQueue(url, crawlerInput.viewport, distFolder)));
}

async function startSpiderBotCrawling({ url, viewport, limit }: CrawlerInput, distFolder: string) {
    const addedToqueue = await addToQueue(url, viewport, distFolder, limit);
    if (!addedToqueue) {
        throw (new Error('Something went wrong while adding job to queue'));
    }
}

export async function addToQueue(url: string, viewport: Viewport, distFolder: string, limit: number = 0): Promise<boolean> {
    const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
    // console.log('addToQueue', cleanUrl, viewport, distFolder);
    const id = md5(`${cleanUrl}-${JSON.stringify(viewport)}`);
    const histFile = join(distFolder, `${id}.json`);
    const queueFile = join(getQueueFolder(distFolder), `${id}.json`);

    if (!(await pathExists(queueFile)) && !(await pathExists(histFile))) {
        if (!limit || (await updateSiblingCount(cleanUrl, distFolder)) < limit) {
            await outputJson(queueFile, { url: cleanUrl, id }, { spaces: 4 });
        }
        return true;
    }
    return false;
}

async function updateSiblingCount(url: string, distFolder: string) {
    const urlPaths = url.split('/').filter(s => s);
    urlPaths.pop();
    const id = md5(urlPaths.join('/'));
    const file = join(distFolder, 'sibling', id);
    let count = 0;
    if (await pathExists(file)) {
        count = parseInt((await readFile(file)).toString(), 10) + 1;
    }
    await outputFile(file, count);
    return count;
}