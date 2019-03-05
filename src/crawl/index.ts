import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, mkdir, readdir } from 'fs-extra';

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
import { getFolders } from '../utils';
import { PageData } from '../typing';

const urlsQueue: string[] = [];
const urlsDone: string[] = [];
let consumerRunning = 0;
let resolver: any;

function saveData(filepath: string, pageData: PageData) {
    return writeFile(`${filepath}.json`, JSON.stringify(pageData, null, 4));
}

async function loadPage(url: string, distFolder: string) {
    let hrefs: string[];
    const id = md5(url);
    const filepath = `${distFolder}/${id}`; // we could add part of the url after the md5
    await saveData(filepath, { url, id });

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
        await writeFile(`${filepath}.html`, html);

        const performance = JSON.parse(await page.evaluate(
            () => JSON.stringify(window.performance),
        ));
        await saveData(filepath, { url, id, performance });

        await page.screenshot({ path: `${filepath}.png`, fullPage: true });
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));

        const urls = hrefs.filter(href => href.indexOf(BASE_URL) === 0);
        addUrls(urls, distFolder);
    } catch (err) {
        await handleError(err, filepath);
    }
    await browser.close();
    info('browser closed', url);
}

async function handleError(err: any, filename: string) {
    error('Load page error', err);
    await writeFile(`${filename}.error`, JSON.stringify(err, null, 4));
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
    const folders = getFolders();
    const cleanUp = folders.slice(0, -(MAX_HISTORY - 1));
    cleanUp.forEach((folder) => {
        info('Clean up history', folder);
        rimraf.sync(`${PAGES_FOLDER}/${folder}`);
    });
}

export async function crawl(distFolder: string): Promise<string[]> {
    cleanHistory();
    await mkdir(distFolder);

    const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        addToQueue(BASE_URL, distFolder);
    });
    await promise;

    return urlsDone;
}
