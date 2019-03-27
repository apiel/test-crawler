import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, readdir, readJSON, move } from 'fs-extra';
import { join } from 'path';
import { promisify } from 'util';

import {
    BASE_URL,
    CONSUMER_COUNT,
    TIMEOUT,
    USER_AGENT,
    CRAWL_FOLDER,
} from '../../lib/config';
import { getFilePath, saveData, addToQueue, getQueueFolder } from '../../lib/utils';
import { prepare } from '../diff';

let consumerRunning = 0;

async function loadPage(id: string, url: string, distFolder: string, retry: number = 0) {
    consumerRunning++;
    let hrefs: string[];
    const filePath = getFilePath(id, distFolder);

    const browser = await launch({
        // headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);

    try {
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: TIMEOUT,
        });
        const html = await page.content();
        await writeFile(filePath('html'), html);

        console.log('to use: page.metrics', await page.metrics());

        const performance = JSON.parse(await page.evaluate(
            () => JSON.stringify(window.performance),
        ));
        await saveData(filePath('json'), { url, id, performance });

        await page.screenshot({ path: filePath('png'), fullPage: true });
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));

        const urls = hrefs.filter(href => href.indexOf(BASE_URL) === 0);
        addUrls(urls, distFolder);

        await prepare(id, distFolder);
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

// shoudl became consumeQueues and dont be to specific distFolder
// then we need another function to get next file to crawl: pickFromQueues()
async function consumeQueues() {
    info('start consumers', `${consumerRunning}`);
    const sleep = promisify(setTimeout);
    do {
        if (consumerRunning < CONSUMER_COUNT) {
            const toCrawl = await pickFromQueues();
            if (toCrawl) {
                const { id, url, distFolder } = toCrawl;
                loadPage(id, url, distFolder);
            }
        } else {
            await sleep(200);
        }
    } while (true);
}

// all the following should go away

export async function crawl() {
    await consumeQueues();
}
