import { launch } from 'puppeteer-core';
import { error, info } from 'logol';
import { USER_AGENT, TIMEOUT, Crawler, Viewport } from 'test-crawler-core';
import { execSync } from 'child_process';
import { dirname, join } from 'path';

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
    await downloadChrome();
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

function downloadChrome() {
    info('check chome');
    // need to use execSync else multiple process will run at the same time
    try {
        const pptrFolder = dirname(require.resolve('puppeteer-core'));
        return execSync(`node ${join(pptrFolder, 'install.js')}`, { stdio: 'inherit' });
    } catch (err) {
        return execSync(`node ./node_modules/puppeteer-core/install.js`, { stdio: 'inherit' });
    }
}
