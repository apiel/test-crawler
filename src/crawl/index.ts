import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, mkdirSync, readdirSync } from 'fs';
import { promisify } from 'util';
import * as md5 from 'md5';
import * as rimraf from 'rimraf';
import { trim } from 'lodash';

import {
    BASE_URL,
    CONSUMER_COUNT,
    MAX_HISTORY,
    PAGES_FOLDER,
    TIMEOUT,
    USER_AGENT,
} from '../config';

const urlsQueue: string[] = [];
const urlsDone: string[] = [];
let consumerRunning = 0;
let resolver: any;

async function loadPage(url: string, distFolder: string) {
    let hrefs: string[];
    const filename = `${distFolder}/${md5(url)}`;

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
        await promisify(writeFile)(`${filename}.html`, html);
        await page.screenshot({ path: `${filename}.png`, fullPage: true });
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));

        const urls = hrefs.filter(href => href.indexOf(BASE_URL) === 0);
        addUrls(urls, distFolder);
    } catch (err) {
        await handleError(err, filename);
    }
    await browser.close();
    info('browser closed', url);
}

async function handleError(err: any, filename: string) {
    error('Load page error', err);
    await promisify(writeFile)(`${filename}.error`, JSON.stringify(err, null, 4));
}

function addUrls(urls: string[], distFolder: string) {
    let count = 0;
    urls.forEach(url => {
        if (addToQueue(url, distFolder)) {
            count++;
        }
    });
    if (count > 0) {
        info('Add urls', `found ${urls.length}, add ${count}, queue size ${urlsQueue.length}`);
    }
}

function addToQueue(url: string, distFolder: string): boolean {
    const url2 = trim(url, '/#?&');
    if (urlsQueue.indexOf(url2) === -1 && urlsDone.indexOf(url2) === -1) {
        urlsQueue.push(url2);
        if (consumerRunning < CONSUMER_COUNT) {
            consumeQueue(distFolder);
        }
        return true;
    }
    return false;
}

async function consumeQueue(distFolder: string) {
    consumerRunning++;
    info('start consumer', `${consumerRunning}`);
    while (urlsQueue.length) {
        const [url] = urlsQueue.splice(0, 1);
        info('Crawl', url);
        urlsDone.push(url);
        await loadPage(url, distFolder);
    }
    info('no more url in queue', JSON.stringify(urlsQueue));
    consumerRunning--;
    info('stop consumer', `${consumerRunning}`);
    if (consumerRunning === 0) {
        resolver();
    }
}

function cleanHistory() {
    const folders = readdirSync(PAGES_FOLDER);
    folders.sort();
    const cleanUp = folders.slice(0, -(MAX_HISTORY - 1));
    cleanUp.forEach((folder) => {
        info('Clean up history', folder);
        rimraf.sync(`${PAGES_FOLDER}/${folder}`);
    });
}

export async function crawl(distFolder: string): Promise<string[]> {
    cleanHistory();
    mkdirSync(distFolder);

    const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        addToQueue(BASE_URL, distFolder);
    });
    await promise;

    return urlsDone;
}
