import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, readdir, readJSON, move, writeJSON } from 'fs-extra';
import { join } from 'path';
import { promisify } from 'util';

import {
    CONSUMER_COUNT,
    TIMEOUT,
    USER_AGENT,
    CRAWL_FOLDER,
} from '../../lib/config';
import { getFilePath, savePageInfo, addToQueue, getQueueFolder } from '../../lib/utils';
import { prepare } from '../diff';
import { Crawler } from '../../lib/typing';

interface ResultQueue {
    result: {
        diffZoneCount: number,
    };
    folder: string;
}

let consumerRunning = 0;
const resultsQueue: ResultQueue[] = [];

async function loadPage(id: string, url: string, distFolder: string, retry: number = 0) {
    consumerRunning++;
    let hrefs: string[];
    const filePath = getFilePath(id, distFolder);

    const { viewport, url: baseUrl }: Crawler = await readJSON(join(distFolder, '_.json'));

    const browser = await launch({
        // headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT); // this should be configurable from crawler file _.json
    await page.setViewport(viewport);

    try {
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: TIMEOUT,
        });
        const html = await page.content();
        await writeFile(filePath('html'), html);

        // to implement
        // console.log('to use: page.metrics', await page.metrics());
        // { Timestamp: 4597.10704,
        //     Documents: 2,
        //     Frames: 1,
        //     JSEventListeners: 24,
        //     Nodes: 64,
        //     LayoutCount: 2,
        //     RecalcStyleCount: 4,
        //     LayoutDuration: 0.370643,
        //     RecalcStyleDuration: 0.065919,
        //     ScriptDuration: 0.658299,
        //     TaskDuration: 1.463009,
        //     JSHeapUsedSize: 17742472,
        //     JSHeapTotalSize: 36044800 }

        const performance = JSON.parse(await page.evaluate(
            () => JSON.stringify(window.performance),
        ));

        await page.screenshot({ path: filePath('png'), fullPage: true });
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));

        const png = { width: viewport.width };
        await savePageInfo(filePath('json'), { url, id, performance, png });

        const urls = hrefs.filter(href => href.indexOf(baseUrl) === 0);
        addUrls(urls, distFolder);

        const result = await prepare(id, distFolder);
        resultsQueue.push({
            result,
            folder: distFolder,
        });
    } catch (err) {
        await handleError(err, filePath('error'));
        if (retry < 2) {
            info('retry crawl', url);
            await loadPage(id, url, distFolder, retry + 1);
        }
        consumerRunning--;
    }
    await browser.close();
    info('browser closed', url);
    consumerRunning--;
}

async function handleError(err: any, file: string) {
    error('Load page error', err);
    await writeFile(file, JSON.stringify(err, null, 4));
}

function addUrls(urls: string[], distFolder: string) {
    let count = 0;
    urls.forEach(url => {
        if (addToQueue(url, distFolder)) {
            count++;
        }
    });
    if (count > 0) {
        info('Add urls', `found ${urls.length}, add ${count}`);
    }
}

async function pickFromQueues() {
    const pagesFolders = await readdir(CRAWL_FOLDER);
    for (const pagesFolder of pagesFolders) {
        const distFolder = join(CRAWL_FOLDER, pagesFolder);
        const queueFolder = getQueueFolder(distFolder);
        const [file] = await readdir(queueFolder);
        if (file) {
            info('Crawl', file);
            const queueFile = join(queueFolder, file);
            const { id, url } = await readJSON(queueFile);
            const filePath = getFilePath(id, distFolder);
            await move(queueFile, filePath('json'));
            return { id, url, distFolder };
        }
    }
}

async function consumeQueues() {
    if (consumerRunning < CONSUMER_COUNT) {
        const toCrawl = await pickFromQueues();
        if (toCrawl) {
            const { id, url, distFolder } = toCrawl;
            loadPage(id, url, distFolder);
        }
        consumeQueues();
    } else {
        setTimeout(consumeQueues, 200);
    }
}

async function consumeResults() {
    if (resultsQueue.length) {
        const [{folder, result}] = resultsQueue.splice(0, 1);
        const file = join(folder, '_.json');
        const crawler: Crawler = await readJSON(file);
        crawler.diffZoneCount += result.diffZoneCount;
        await writeJSON(file, crawler, { spaces: 4 });
        consumeResults();
    } else {
        setTimeout(consumeResults, 1000);
    }
}

export function crawl() {
    consumeResults();
    consumeQueues();
}
