import { Page, Viewport } from 'puppeteer';
import { error, info, warn } from 'logol';
import { readJSON, pathExists, outputJson } from 'fs-extra';
import { join } from 'path';
import * as minimatch from 'minimatch';
import { WebDriver } from 'selenium-webdriver';

import {
    CODE_FOLDER,
    PROJECT_FOLDER,
    ROOT_FOLDER,
} from '../config';

import { CrawlerMethod } from '../index';
import { prepare } from '../diff';
import { Crawler, Browser } from '../../typing';
import { isArray } from 'util';
import { CrawlerProvider } from '../CrawlerProvider';
import { StorageType } from '../../storage.typing';
import { startPuppeteer } from './browsers/puppeteer';
import { startSeleniumFirefox } from './browsers/selenium-firefox';
import { startSeleniumChrome } from './browsers/selenium-chrome';
import { startSeleniumIE } from './browsers/selenium-ie';
// import { startSeleniumEdge } from './browsers/selenium-edge';
import { startSeleniumSafari } from './browsers/selenium-safari';
import { pushToResultConsumer } from './resultConsumer';
import { addToQueue } from './startCrawler';

function startBrowser(
    browser: Browser,
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
) {
    if (browser === Browser.FirefoxSelenium) {
        return startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
    }
    else if (browser === Browser.ChromePuppeteer) {
        return startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
    }
    else if (browser === Browser.IeSelenium) {
        return startSeleniumIE(viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
    }
    // else if (browser === Browser.EdgeSelenium) {
    //     return startSeleniumEdge(viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
    // }
    else if (browser === Browser.SafariSelenium) {
        return startSeleniumSafari(viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
    }
    return startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
}

export async function loadPage(
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
    done: () => void,
    retry: number = 0,
) {
    const jsonFile = join(distFolder, `${id}.json`);
    const pngFile = join(distFolder, `${id}.png`);
    const htmlFile = join(distFolder, `${id}.html`);

    const crawler: Crawler = await readJSON(join(distFolder, '_.json'));
    const { viewport, url: baseUrl, method, limit, browser } = crawler;

    try {
        const { links, ...output } = await startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url, distFolder);
        await outputJson(jsonFile, output, { spaces: 4 });

        if (method !== CrawlerMethod.URLs && isArray(links)) {
            const siteUrls = links.filter(href => href.indexOf(baseUrl) === 0)
            await addUrls(siteUrls, viewport, distFolder, limit);
        }

        const result = await prepare(projectId, id, distFolder, crawler);
        pushToResultConsumer({
            result,
            folder: distFolder,
            isError: !!output.error,
        });
    } catch (err) {
        error(`Load page error (attempt ${retry + 1})`, err.toString());
        if (retry < 2) {
            warn('Retry crawl', url);
            await loadPage(projectId, id, url, distFolder, done, retry + 1);
        } else {
            await outputJson(jsonFile, { url, id, error: err.toString() }, { spaces: 4 });
            pushToResultConsumer({
                folder: distFolder,
                isError: true,
            });
        }
    } finally {
        done();
    }
}

export async function injectCodes(
    page: Page | WebDriver,
    projectId: string,
    id: string,
    url: string,
    links: string[],
    distFolder: string,
    crawler: Crawler,
) {
    const crawlerProvider = new CrawlerProvider(StorageType.Local);
    const list = await crawlerProvider.getCodeList(projectId, true);
    // console.log('injectCodes list', list);
    // console.log('Object.values', Object.values(list));
    const toInject = Object.values(list).filter(({ pattern }) => {
        return minimatch(url, pattern);
    }) as any;
    info(toInject.length, 'code(s) to inject for', url);
    for (const codeInfo of toInject) {
        const sourcePath = join(ROOT_FOLDER, PROJECT_FOLDER, projectId, CODE_FOLDER, `${codeInfo.id}.js`);
        links = await injectCode(sourcePath, page, id, url, links, distFolder, crawler);
    }
    return links;
}

async function injectCode(
    jsFile: string,
    page: Page | WebDriver,
    id: string,
    url: string,
    links: string[],
    distFolder: string,
    crawler: Crawler,
) {
    if (await pathExists(jsFile)) {
        info('Inject code', url, links);
        const fn = require(jsFile);
        const newLinks = await fn(page, url, links, id, crawler, distFolder);
        return newLinks || links;
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