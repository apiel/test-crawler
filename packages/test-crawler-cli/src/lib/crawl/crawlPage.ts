import { Page } from 'puppeteer';
// type Page = any;
import { error, info, warn } from 'logol';
import { readJSON, pathExists, outputJson } from 'fs-extra';
import * as minimatch from 'minimatch';
import { WebDriver } from 'selenium-webdriver';
import { isArray } from 'util';
import { Crawler, CrawlerMethod } from 'test-crawler-core';

import { prepare } from '../diff';
import { getCodeList } from '../utils';
import { pushToResultConsumer } from './resultConsumer';
import { startBrowser } from './browsers/browser';
import {
    pathInfoFile,
    pathSourceFile,
    pathImageFile,
    pathCrawlerFile,
    pathCodeJsFile,
} from '../path';
import { pushToCrawl } from './crawlerConsumer';

export async function loadPage(
    projectId: string,
    id: string,
    url: string,
    timestamp: string,
    retry: number = 0,
) {
    const jsonFile = pathInfoFile(projectId, timestamp, id);
    const pngFile = pathImageFile(projectId, timestamp, id);
    const htmlFile = pathSourceFile(projectId, timestamp, id);

    const crawler: Crawler = await readJSON(
        pathCrawlerFile(projectId, timestamp),
    );
    const { viewport, url: baseUrl, method, limit, browser } = crawler;

    try {
        const { links, ...output } = await startBrowser(
            browser,
            viewport,
            pngFile,
            htmlFile,
            crawler,
            projectId,
            id,
            url,
        );
        await outputJson(jsonFile, { ...output, timestamp }, { spaces: 4 });

        if (method !== CrawlerMethod.URLs && isArray(links)) {
            const siteUrls = links.filter(href => href.indexOf(baseUrl) === 0);
            await addUrls(siteUrls, projectId, timestamp, limit);
        }

        const result = await prepare(projectId, timestamp, id, crawler);
        pushToResultConsumer({
            result,
            projectId,
            timestamp,
            isError: !!output.error,
        });
    } catch (err) {
        error(`Load page error (attempt ${retry + 1})`, err.toString());
        if (retry < 2) {
            warn('Retry crawl', url);
            await loadPage(projectId, id, url, timestamp, retry + 1);
        } else {
            await outputJson(
                jsonFile,
                { url, id, error: err.toString() },
                { spaces: 4 },
            );
            pushToResultConsumer({
                projectId,
                timestamp,
                isError: true,
            });
        }
    }
}

export async function injectCodes(
    page: Page | WebDriver,
    projectId: string,
    id: string,
    url: string,
    links: string[],
    crawler: Crawler,
) {
    const list = await getCodeList(projectId);
    const toInject = Object.values(list).filter(({ pattern }) => {
        return minimatch(url, pattern);
    }) as any;
    info(toInject.length, 'code(s) to inject for', url);
    for (const codeInfo of toInject) {
        const jsFile = pathCodeJsFile(projectId, codeInfo.id);
        links = await injectCode(jsFile, page, id, url, links, crawler);
    }
    return links;
}

async function injectCode(
    jsFile: string,
    page: Page | WebDriver,
    id: string,
    url: string,
    links: string[],
    crawler: Crawler,
) {
    if (await pathExists(jsFile)) {
        info('Inject code', url, links);
        const fn = require(jsFile);
        const newLinks = await fn(page, url, links, id, crawler);
        return newLinks || links;
    }
    return links;
}

async function addUrls(
    urls: string[],
    projectId: string,
    timestamp: string,
    limit: number,
) {
    let count = 0;
    for (const url of urls) {
        if (await pushToCrawl(url, projectId, timestamp, limit)) {
            count++;
        }
    }
    if (count > 0) {
        info('Add urls', `found ${urls.length}, add ${count}`);
    }
}
