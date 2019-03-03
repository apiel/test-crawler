import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, mkdirSync, readdirSync } from 'fs';
import { promisify } from 'util';
import * as md5 from 'md5';
import * as rimraf from 'rimraf';
import { trim } from 'lodash';

const BASE_URL = 'https://www.zooplus.de/tierarzt';
const PAGES_FOLDER = `${__dirname}/../pages`;
const MAX_HISTORY = 2;
const TIMEOUT = 10000; // 10 sec
const CONSUMER_COUNT = 5;

const urlsQueue: string[] = [];
const urlsDone: string[] = [];
let consumerRunning = 0;

async function loadPage(url: string, distFolder: string) {
    let hrefs: string[];
    const filename = `${distFolder}/${md5(url)}`;

    const browser = await launch({
        // headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Alex-test-crawler');
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

function start() {
    cleanHistory();
    const timestamp = Math.floor(Date.now() / 1000);
    const distFolder = `${PAGES_FOLDER}/${timestamp}`;
    info('Dist folder', distFolder);
    mkdirSync(distFolder);
    addToQueue(BASE_URL, distFolder);
}

start();
