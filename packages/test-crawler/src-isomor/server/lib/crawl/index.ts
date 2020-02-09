import { launch, Page, Viewport } from 'puppeteer';
import { error, info, warn } from 'logol';
import { writeFile, readdir, readJSON, move, writeJSON, pathExists, mkdirp, outputJson, outputJSON, readFile, outputFile } from 'fs-extra';
import { join, extname } from 'path';
import * as minimatch from 'minimatch';

import {
    CONSUMER_COUNT,
    TIMEOUT,
    USER_AGENT,
    CRAWL_FOLDER,
    CONSUME_TIMEOUT,
    CODE_FOLDER,
    PROJECT_FOLDER,
    MAX_HISTORY,
} from '../config';
import {
    getFilePath,
} from '../utils';
import { CrawlerMethod } from '../index';
import { prepare } from '../diff';
import { Crawler, CrawlerInput, CrawlTarget } from '../../typing';
import { isArray, promisify } from 'util';
import { CrawlerProvider } from '../CrawlerProvider';
import rimraf = require('rimraf');
import Axios from 'axios';
import md5 = require('md5');
import { StorageType } from '../../storage.typing';

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


export async function getFolders(projectId: string) {
    const projectFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
    await mkdirp(projectFolder);
    const folders = await readdir(projectFolder);
    folders.sort();

    return folders;
}

export async function addToQueue(url: string, viewport: Viewport, distFolder: string, limit: number = 0): Promise<boolean> {
    console.log('addToQueue', url, viewport, distFolder);
    const id = md5(`${url}-${JSON.stringify(viewport)}`);
    const histFile = getFilePath(id, distFolder)('json');
    const queueFile = getFilePath(id, getQueueFolder(distFolder))('json');

    if (!(await pathExists(queueFile)) && !(await pathExists(histFile))) {
        if (!limit || (await updateSiblingCount(url, distFolder)) < limit) {
            await outputJson(queueFile, { url, id }, { spaces: 4 });
        }
        return true;
    }
    return false;
}

async function updateSiblingCount(url: string, distFolder: string) {
    const urlPaths = url.split('/').filter(s => s);
    urlPaths.pop();
    const id = md5(urlPaths.join('/'));
    const file = join(distFolder, 'sibling', id);
    let count = 0;
    if (await pathExists(file)) {
        count = parseInt((await readFile(file)).toString(), 10) + 1;
    }
    await outputFile(file, count);
    return count;
}

export function getQueueFolder(distFolder: string) {
    return join(distFolder, 'queue');
}

async function getLinks(page: Page, crawler: Crawler): Promise<string[]> {
    const { url: baseUrl, method } = crawler;
    if (method === CrawlerMethod.URLs) {
        return [];
    }
    const hrefs = await page.$$eval('a', as => as.map(a => (a as any).href));
    // console.log('baseUrl', baseUrl, hrefs.filter(href => href.indexOf(baseUrl) === 0));
    return hrefs.filter(href => href.indexOf(baseUrl) === 0);
}

async function loadPage(projectId: string, id: string, url: string, distFolder: string, retry: number = 0) {
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
            links = await injectCodes(page, projectId, id, url, injectLinks, distFolder, crawler);
            // console.log('links', links);
        } catch (err) {
            codeErr = err.toString();
            error('Something went wrong while injecting the code', id, url, err);
        }

        await page.screenshot({ path: filePath('png'), fullPage: true });

        const png = { width: viewport.width };
        await outputJson(
            filePath('json'),
            { url, id, performance, metrics, png, viewport, baseUrl, error: codeErr },
            { spaces: 4 },
        );


        if (method !== CrawlerMethod.URLs) {
            const urls = isArray(links) ? links : await getLinks(page, crawler);
            await addUrls(urls, viewport, distFolder, limit);
        }

        const result = await prepare(projectId, id, distFolder, crawler);
        resultsQueue.push({
            result,
            folder: distFolder,
            isError: !!codeErr,
        });
    } catch (err) {
        error(`Load page error (attempt ${retry + 1})`, err.toString());
        if (retry < 2) {
            warn('Retry crawl', url);
            await loadPage(projectId, id, url, distFolder, retry + 1);
        } else {
            await outputJson(filePath('json'), { url, id, error: err.toString() }, { spaces: 4 });
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
    projectId: string,
    id: string,
    url: string,
    links: string[],
    distFolder: string,
    crawler: Crawler,
) {
    const crawlerProvider = new CrawlerProvider();
    const list = await crawlerProvider.getCodeList(StorageType.Local, projectId, true);
    // console.log('injectCodes list', list);
    // console.log('Object.values', Object.values(list));
    const toInject = Object.values(list).filter(({ pattern }) => {
        return minimatch(url, pattern);
    }) as any;
    info(toInject.length, 'code(s) to inject for', url);
    for (const codeInfo of toInject) {
        const sourcePath = join(PROJECT_FOLDER, projectId, CODE_FOLDER, `${codeInfo.id}.js`);
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

interface ToCrawl {
    projectId: string;
    id: any;
    url: any;
    distFolder: string;
};

async function pickFromQueue(projectId: string, pagesFolder: string): Promise<ToCrawl> {
    const distFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, pagesFolder);
    const queueFolder = getQueueFolder(distFolder);
    if (await pathExists(queueFolder)) {
        const [file] = await readdir(queueFolder);
        if (file) {
            info('Crawl', file);
            try {
                const queueFile = join(queueFolder, file);
                const { id, url } = await readJSON(queueFile);
                const filePath = getFilePath(id, distFolder);
                await move(queueFile, filePath('json'));
                return { projectId, id, url, distFolder };
            } catch (error) {
                warn('Crawl possible error', error);
            }
        }
    }
}

async function pickFromQueues(): Promise<ToCrawl> {
    const projectFolders = await readdir(PROJECT_FOLDER);
    for (const projectId of projectFolders) {
        const crawlFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
        await mkdirp(crawlFolder);
        const pagesFolders = await readdir(crawlFolder);
        for (const pagesFolder of pagesFolders) {
            const toCrawl = await pickFromQueue(projectId, pagesFolder);
            if (toCrawl) {
                return toCrawl;
            }
        }
    }
}

let consumeQueuesRetry = 0;
async function consumeQueues(consumeTimeout: number, crawlTarget: CrawlTarget) {
    if (consumerRunning < CONSUMER_COUNT) {
        let toCrawl: ToCrawl;
        if (crawlTarget) {
            toCrawl = await pickFromQueue(crawlTarget.projectId, crawlTarget.pagesFolder);
        } else {
            toCrawl = await pickFromQueues();
        }
        // console.log('toCrawl', toCrawl);
        if (toCrawl) {
            consumeQueuesRetry = 0;
            const { projectId, id, url, distFolder } = toCrawl;
            loadPage(projectId, id, url, distFolder);
            consumeQueues(consumeTimeout, crawlTarget);
            return;
        }
    }
    if (!consumeTimeout || consumeQueuesRetry < consumeTimeout) {
        consumeQueuesRetry++;
        setTimeout(() => consumeQueues(consumeTimeout, crawlTarget), 500);
    } else {
        info('consumeQueues timeout');
    }
}

let consumeResultRetry = 0;
async function consumeResults(consumeTimeout: number, push?: (payload: any) => void) {
    // console.log('resultsQueue.length', resultsQueue.length, consumeResultRetry, consumeTimeout);
    if (resultsQueue.length) {
        consumeResultRetry = 0;
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
        push && push(crawler);
        consumeResults(consumeTimeout, push);
    } else if (!consumeTimeout || consumeResultRetry < consumeTimeout) {
        consumeResultRetry++;
        setTimeout(() => consumeResults(consumeTimeout, push), 1000);
    } else {
        info('consumeResults timeout');
    }
}

async function prepareFolders() {
    if (!(await pathExists(PROJECT_FOLDER))) {
        await mkdirp(PROJECT_FOLDER);
    }
    return cleanHistory();
}

async function cleanHistory() {
    const projects = await readdir(PROJECT_FOLDER);
    for (const project of projects) {
        const crawlFolder = join(PROJECT_FOLDER, project, CRAWL_FOLDER);
        if (await pathExists(crawlFolder)) {
            const results = await readdir(crawlFolder);
            const cleanUp = results.slice(0, -(MAX_HISTORY - 1));
            for (const toRemove of cleanUp) {
                await promisify(rimraf)(join(crawlFolder, toRemove));
            }
        }
    }
}

async function startCrawler({ projectId, pagesFolder }: CrawlTarget) {
    const crawlerProvider = new CrawlerProvider();
    const { crawlerInput } = await crawlerProvider.loadProject(StorageType.Local, projectId);

    const id = md5(`${pagesFolder}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);

    const crawler: Crawler = {
        ...crawlerInput,
        timestamp: pagesFolder,
        id,
        diffZoneCount: 0,
        errorCount: 0,
        status: 'review',
        inQueue: 1,
        urlsCount: 0,
        startAt: Date.now(),
        lastUpdate: Date.now(),
    };

    const distFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, pagesFolder);
    await outputJSON(join(distFolder, '_.json'), crawler, { spaces: 4 });

    if (crawlerInput.method === CrawlerMethod.URLs) {
        await startUrlsCrawling(crawlerInput, distFolder);
    } else {
        await startSpiderBotCrawling(crawlerInput, distFolder);
    }
}

async function startUrlsCrawling(crawlerInput: CrawlerInput, distFolder: string) {
    const { data } = await Axios.get(crawlerInput.url);
    const urls = data.split(`\n`).filter((url: string) => url.trim());
    await Promise.all(urls.map((url: string) =>
        addToQueue(url, crawlerInput.viewport, distFolder)));
}

async function startSpiderBotCrawling({ url, viewport, limit }: CrawlerInput, distFolder: string) {
    const addedToqueue = await addToQueue(url, viewport, distFolder, limit);
    if (!addedToqueue) {
        throw (new Error('Something went wrong while adding job to queue'));
    }
}

export async function crawl(
    crawlTarget?: CrawlTarget,
    consumeTimeout = CONSUME_TIMEOUT,
    push?: (payload: any) => void,
) {
    await prepareFolders();
    crawlTarget && startCrawler(crawlTarget);
    consumeQueuesRetry = 0;
    consumeResultRetry = 0;
    consumeResults(consumeTimeout, push);
    consumeQueues(consumeTimeout, crawlTarget);
}
