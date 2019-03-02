import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, mkdirSync, readdirSync } from 'fs';
import { promisify } from 'util';
import * as md5 from 'md5';
import * as rimraf from 'rimraf';

const BASE_URL = 'https://www.zooplus.de/tierarzt';
const PAGES_FOLDER = `${__dirname}/../pages`;
const MAX_HISTORY = 2;

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
            timeout: 3000,
        });
        const html = await page.content();
        const filename = `${distFolder}/${md5(url)}`;
        await promisify(writeFile)(`${filename}.html`, html);
        await page.screenshot({ path: `${filename}.png`, fullPage: true });
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));
    } catch (err) {
        error('ERR', err);
    }

    await browser.close();

    const urls = hrefs.filter(href => href.indexOf(BASE_URL) === 0);
    console.log('urls', urls);
}

function cleanHistory() {
    const folders = readdirSync(PAGES_FOLDER);
    folders.sort();
    const cleanUp = folders.slice(0, -(MAX_HISTORY-1));
    cleanUp.forEach((folder) => {
        info('Clean up history', folder);
        rimraf.sync(`${PAGES_FOLDER}/${folder}`);
    });
}

function start() {
    cleanHistory();
    const timestamp = Math.floor(Date.now() / 1000);
    const distFolder = `${PAGES_FOLDER}/${timestamp}`;
    info('Dist folder:', distFolder);
    mkdirSync(distFolder);
    loadPage(BASE_URL, distFolder);
}

start();
