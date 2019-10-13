import { launch, Page, Viewport } from 'puppeteer';
import { error, info, warn } from 'logol';
import { writeFile, readdir, readJSON, move, writeJSON, pathExists, mkdirp } from 'fs-extra';
import { join, extname } from 'path';
import * as minimatch from 'minimatch';

import {
    CONSUMER_COUNT,
    TIMEOUT,
    USER_AGENT,
    CRAWL_FOLDER,
    BASE_FOLDER,
    PROCESS_TIMEOUT,
    CODE_FOLDER,
} from '../../dist-server/server/lib/config';
import {
    getFilePath,
    savePageInfo,
    addToQueue,
    getQueueFolder,
    getCodeList,
} from '../../dist-server/server/lib/utils';
import { CrawlerMethod } from '../../dist-server/server/lib';
import { prepare } from '../diff';
import { Crawler } from '../../src-isomor/server/typing';
import { isArray } from 'util';

interface ResultQueue {
    result?: {
        diffZoneCount: number,
    };
    folder: string;
    isError?: boolean;
}

let totalDiff = 0;
let consumerRunning = 0;
const resultsQueue: ResultQueue[] = [];

async function getLinks(page: Page, crawler: Crawler): Promise<string[]> {
    const { url: baseUrl, method } = crawler;
    if (method === CrawlerMethod.URLs) {
        return [];
    }
    const hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));
    // console.log('baseUrl', baseUrl, hrefs.filter(href => href.indexOf(baseUrl) === 0));
    return hrefs.filter(href => href.indexOf(baseUrl) === 0);
}

async function loadPage(id: string, url: string, distFolder: string, retry: number = 0) {
    consumerRunning++;
    let links: string[];
    const filePath = getFilePath(id, distFolder);

    const crawler: Crawler = await readJSON(join(distFolder, '_.json'));
    const { viewport, url: baseUrl, method, limit } = crawler;

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

        const metrics = await page.metrics();
        const performance = JSON.parse(await page.evaluate(
            () => JSON.stringify(window.performance),
        ));

        let codeErr: string;
        try {
            const injectLinks = await getLinks(page, crawler);
            links = await injectCodes(page, id, url, injectLinks, distFolder, crawler);
            // console.log('links', links);
        } catch (err) {
            codeErr = err.toString();
            error('Something went wrong while injecting the code', id, url, err);
        }

        await page.screenshot({ path: filePath('png'), fullPage: true });

        const png = { width: viewport.width };
        await savePageInfo(
            filePath('json'),
            { url, id, performance, metrics, png, viewport, baseUrl, error: codeErr },
        );

        if (method !== CrawlerMethod.URLs) {
            const urls = isArray(links) ? links : await getLinks(page, crawler);
            await addUrls(urls, viewport, distFolder, limit);
        }

        const result = await prepare(id, distFolder, crawler);
        resultsQueue.push({
            result,
            folder: distFolder,
            isError: !!codeErr,
        });
    } catch (err) {
        error(`Load page error (attempt ${retry + 1})`, err.toString());
        if (retry < 2) {
            warn('Retry crawl', url);
            await loadPage(id, url, distFolder, retry + 1);
        } else {
            await savePageInfo(filePath('json'), { url, id, error: err.toString() });
            resultsQueue.push({
                folder: distFolder,
                isError: true,
            });
        }
        consumerRunning--;
    }
    await browser.close();
    info('browser closed', url);
    consumerRunning--;
}

async function injectCodes(
    page: Page,
    id: string,
    url: string,
    links: string[],
    distFolder: string,
    crawler: Crawler,
) {
    const list = await getCodeList();
    // console.log('injectCodes list', list);
    // console.log('Object.values', Object.values(list));
    const toInject = Object.values(list).filter(({ pattern }) => {
        return minimatch(url, pattern);
    });
    info(toInject.length, 'code(s) to inject for', url);
    for (const codeInfo of toInject) {
        const sourcePath = join(CODE_FOLDER, `${codeInfo.id}.js`);
        links = await injectCode(sourcePath, page, id, url, links, distFolder, crawler);
    }
    return links;
}

async function injectCode(
    jsFile: string,
    page: Page,
    id: string,
    url: string,
    links: string[],
    distFolder: string,
    crawler: Crawler,
) {
    if (await pathExists(jsFile)) {
        info('Inject code', url, links);
        const fn = require(jsFile);
        return await fn(page, url, links, id, crawler, distFolder);
    }
    return links;
}

async function addUrls(urls: string[], viewport: Viewport, distFolder: string, limit: number) {
    let count = 0;
    for (const url of urls) {
        if (await addToQueue(url, viewport, distFolder, limit)) {
            count++;
        }
    }
    if (count > 0) {
        info('Add urls', `found ${urls.length}, add ${count}`);
    }
}

async function pickFromQueues() {
    const pagesFolders = await readdir(CRAWL_FOLDER);
    for (const pagesFolder of pagesFolders) {
        const distFolder = join(CRAWL_FOLDER, pagesFolder);
        const queueFolder = getQueueFolder(distFolder);
        if (await pathExists(queueFolder)) {
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

let processTimeoutTimer: NodeJS.Timeout;
function processTimeout() {
    if (PROCESS_TIMEOUT) {
        clearTimeout(processTimeoutTimer);
        processTimeoutTimer = setTimeout(() => {
            info('Process timeout, exit', `${PROCESS_TIMEOUT} sec inactivity`);
            process.exit(totalDiff);
        }, PROCESS_TIMEOUT * 1000);
    }
}

async function consumeResults() {
    if (resultsQueue.length) {
        const [{ folder, result, isError }] = resultsQueue.splice(0, 1);
        const file = join(folder, '_.json');
        const crawler: Crawler = await readJSON(file);
        if (result) {
            crawler.diffZoneCount += result.diffZoneCount;
            totalDiff += result.diffZoneCount;
        }
        if (isError) {
            crawler.errorCount++;
        }

        const queueFolder = getQueueFolder(folder);
        const filesInQueue = await pathExists(queueFolder) ? await readdir(queueFolder) : [];
        crawler.inQueue = filesInQueue.length;
        crawler.urlsCount = (await readdir(folder)).filter(f => extname(f) === '.json' && f !== '_.json').length;
        crawler.lastUpdate = Date.now();

        await writeJSON(file, crawler, { spaces: 4 });
        consumeResults();
        processTimeout();
    } else {
        setTimeout(consumeResults, 1000);
    }
}

async function prepareFolders() {
    if (!(await pathExists(CRAWL_FOLDER))) {
        await mkdirp(CRAWL_FOLDER);
    }
    if (!(await pathExists(BASE_FOLDER))) {
        await mkdirp(BASE_FOLDER);
    }
}

export async function crawl() {
    await prepareFolders();
    consumeResults();
    consumeQueues();
    processTimeout();
}
