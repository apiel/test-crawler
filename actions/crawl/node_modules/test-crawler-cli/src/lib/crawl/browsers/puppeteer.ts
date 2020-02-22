import { launch } from 'puppeteer';
// const { launch } = require('puppeteer');
import { error, info } from 'logol';
import { USER_AGENT, TIMEOUT, Crawler, Viewport } from 'test-crawler-core';

import { writeFile } from 'fs-extra';
import { injectCodes } from '../crawlPage';

export async function startPuppeteer(
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
) {
    const browser = await launch({
        // headless: false,
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT); // this should be configurable from crawler file _.json
        await page.setViewport(viewport);

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: TIMEOUT,
        });
        const html = await page.content();
        await writeFile(htmlFile, html);

        const metrics = await page.metrics();
        const performance = JSON.parse(
            await page.evaluate(() => JSON.stringify(window.performance)),
        );

        let codeErr: string;
        let links: string[];
        try {
            const injectLinks = await page.$$eval('a', as =>
                as.map(a => (a as any).href),
            );
            links = await injectCodes(
                page,
                projectId,
                id,
                url,
                injectLinks,
                crawler,
            );
            // console.log('links', links);
        } catch (err) {
            codeErr = err.toString();
            error(
                'Something went wrong while injecting the code',
                id,
                url,
                err,
            );
        }

        await page.screenshot({ path: pngFile, fullPage: true });

        const png = { width: viewport.width };

        return {
            links,
            url,
            id,
            performance,
            metrics,
            png,
            viewport,
            error: codeErr,
        };
    } finally {
        await browser.close();
        info('browser closed', url);
    }
}
