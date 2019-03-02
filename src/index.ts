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

const urlsQueue: string[] = [];
const urlsDone: string[] = [];

async function loadPage(url: string, distFolder: string) {
    let hrefs: string[];
    const browser = await launch({
        // headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Alex-test-crawler');
    try {
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 10000, // 10sec -> Need to fix { TimeoutError: Navigation Timeout Exceeded: 3000ms exceeded at Promise.then
        });
        const html = await page.content();
        const filename = `${distFolder}/${md5(url)}`;
        await promisify(writeFile)(`${filename}.html`, html);
        await page.screenshot({ path: `${filename}.png`, fullPage: true });
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));

        const urls = hrefs.filter(href => href.indexOf(BASE_URL) === 0);
        addUrls(urls);
    } catch (err) {
        error('ERR', err);
    }

    await browser.close();
}

function addUrls(urls: string[]) {
    let count = 0;
    urls.forEach(url => {
        if (addToQueue(url)) {
            count++;
        }
    });
    if (count > 0) {
        info('Add urls', `${count}, queue size ${urlsQueue.length}`);
    }
}

function addToQueue(url: string): boolean {
    const _url = trim(url, '/#');
    if (urlsQueue.indexOf(_url) === -1 && urlsDone.indexOf(_url) === -1) {
        urlsQueue.push(_url);
        return false;
    }
    return true;
}

async function consumeQueue(distFolder: string) {
    while (urlsQueue.length) {
        const [url] = urlsQueue.splice(0);
        info('Crawl', url);
        urlsDone.push(url);
        await loadPage(url, distFolder);
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

function start() {
    cleanHistory();
    const timestamp = Math.floor(Date.now() / 1000);
    const distFolder = `${PAGES_FOLDER}/${timestamp}`;
    info('Dist folder', distFolder);
    mkdirSync(distFolder);
    addToQueue(BASE_URL);
    consumeQueue(distFolder);
}

start();
