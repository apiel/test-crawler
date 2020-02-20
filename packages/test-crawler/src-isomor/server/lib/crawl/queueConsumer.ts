import { Page, Viewport } from 'puppeteer';
import { error, info, warn } from 'logol';
import { readdir, readJSON, move, writeJSON, pathExists, mkdirp, outputJson, outputJSON, readFile, outputFile } from 'fs-extra';
import { join, extname } from 'path';
import * as minimatch from 'minimatch';
import { WebDriver } from 'selenium-webdriver';

import {
    CONSUMER_COUNT,
    CRAWL_FOLDER,
    CONSUME_TIMEOUT,
    CODE_FOLDER,
    PROJECT_FOLDER,
    MAX_HISTORY,
    ROOT_FOLDER,
} from '../config';

import { CrawlerMethod } from '../index';
import { prepare } from '../diff';
import { Crawler, CrawlerInput, CrawlTarget, Browser, Project } from '../../typing';
import { isArray, promisify } from 'util';
import { CrawlerProvider } from '../CrawlerProvider';
import rimraf = require('rimraf');
import Axios from 'axios';
import md5 = require('md5');
import { StorageType } from '../../storage.typing';
import { startPuppeteer } from './browsers/puppeteer';
import { startSeleniumFirefox } from './browsers/selenium-firefox';
import { startSeleniumChrome } from './browsers/selenium-chrome';
import { startSeleniumIE } from './browsers/selenium-ie';
// import { startSeleniumEdge } from './browsers/selenium-edge';
import { startSeleniumSafari } from './browsers/selenium-safari';
import { loadPage } from './crawlPage';
import { initConsumeResults } from './resultConsumer';
import { getQueueFolder } from './utils';


interface ToCrawl {
    projectId: string;
    id: any;
    url: any;
    distFolder: string;
};

let consumerRunning = 0;
let consumerMaxCount = CONSUMER_COUNT;

// some browser support only one instance at once
export async function setConsumerMaxCount(crawlTarget: CrawlTarget) {
    const { crawlerInput: { browser } }: Project = await readJSON(join(ROOT_FOLDER, PROJECT_FOLDER, crawlTarget.projectId, 'project.json'));
    if (browser === Browser.IeSelenium
        // || browser === Browser.EdgeSelenium
        || browser === Browser.SafariSelenium) {
        consumerMaxCount = 1;
    }
    info('Max consumer', consumerMaxCount);
}

function getConsumerMaxCount() {
    return consumerMaxCount;
}

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
                await move(queueFile, join(distFolder, `${id}.json`));
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

export function initConsumeQueues(consumeTimeout: number, crawlTarget: CrawlTarget) {
    consumeQueuesRetry = 0;
    return consumeQueues(consumeTimeout, crawlTarget);
}

async function consumeQueues(consumeTimeout: number, crawlTarget: CrawlTarget) {
    if (consumerRunning < getConsumerMaxCount()) {
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
            consumerRunning++;
            loadPage(projectId, id, url, distFolder, () => consumerRunning--);
            consumeQueues(consumeTimeout, crawlTarget);
            return;
        }
    }
    if (!consumeTimeout || consumeQueuesRetry < consumeTimeout) {
        if (consumerRunning < getConsumerMaxCount()) {
            consumeQueuesRetry++;
        }
        setTimeout(() => consumeQueues(consumeTimeout, crawlTarget), 500);
    } else {
        info('consumeQueues timeout');
    }
}