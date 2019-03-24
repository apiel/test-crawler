import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, mkdir, pathExists, readdir, writeJson, readJSON, move } from 'fs-extra';
import { join } from 'path';

import * as md5 from 'md5';
import * as rimraf from 'rimraf';

import {
    BASE_URL,
    CONSUMER_COUNT,
    MAX_HISTORY,
    TIMEOUT,
    USER_AGENT,
    CRAWL_FOLDER,
} from '../config';
import { getFolders, getFilePath } from '../utils';
import { PageData } from '../typing';
import { prepare } from '../diff';
import { promisify } from 'util';

let consumerRunning = 0;

function saveData(file: string, pageData: PageData) {
    return writeJson(file, pageData, { spaces: 4 });
}

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

async function addToQueue(url: string, distFolder: string): Promise<boolean> {
    const id = md5(url);
    const histFile = getFilePath(id, distFolder)('json');
    const queueFile = getFilePath(id, getQueueFolder(distFolder))('json');

    if (!(await pathExists(queueFile)) && !(await pathExists(histFile))) {
        await saveData(queueFile, { url, id });
        return true;
    }
    return false;
}

async function consumeQueue(distFolder: string) {
    info('start consumer', `${consumerRunning}`);
    const queueFolder = getQueueFolder(distFolder);
    const sleep = promisify(setTimeout);
    do {
        if (consumerRunning < CONSUMER_COUNT) {
            const [file] = await readdir(queueFolder);
            if (file) {
                info('Crawl', file);
                const queueFile = join(queueFolder, file);
                const { id, url } = await readJSON(queueFile);
                const filePath = getFilePath(id, distFolder);
                await move(queueFile, filePath('json'));
                loadPage(id, url, distFolder);
            }
        } else {
            await sleep(200);
        }
    } while (true);
}

function cleanHistory() {
    const folders = getFolders();
    const cleanUp = folders.slice(0, -(MAX_HISTORY - 1));
    cleanUp.forEach((folder) => {
        info('Clean up history', folder);
        rimraf.sync(join(CRAWL_FOLDER, folder));
    });
}

function getQueueFolder(distFolder: string) {
    return join(distFolder, 'queue');
}

export async function crawl() {
    cleanHistory();

    const distFolder = join(CRAWL_FOLDER, (Math.floor(Date.now() / 1000)).toString());
    info('Dist folder', distFolder);
    await mkdir(distFolder);
    await mkdir(getQueueFolder(distFolder));

    await addToQueue(BASE_URL, distFolder);
    await consumeQueue(distFolder);
}
