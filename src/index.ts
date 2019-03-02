import { launch } from 'puppeteer';
import { error, info } from 'npmlog';
import { writeFile, mkdirSync } from 'fs';
import { promisify } from 'util';
import * as md5 from 'md5';

const BASE_URL = 'https://www.zooplus.de/tierarzt';
const PAGE_FOLDER = `${__dirname}/../pages`;

async function loadPage(url: string, baseUrl: string, distFolder: string) {
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
        await page.screenshot({path: `${filename}.png`});
        hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));
    } catch (err) {
        error('ERR', err);
    }

    await browser.close();

    const urls = hrefs.filter(href => href.indexOf(baseUrl) === 0);
    console.log('urls', urls);
}

function start() {
    const timestamp = Math.floor(Date.now() / 1000);
    const distFolder = `${PAGE_FOLDER}/${timestamp}`;
    mkdirSync(distFolder);
    loadPage(BASE_URL, BASE_URL, distFolder);
}

start();
