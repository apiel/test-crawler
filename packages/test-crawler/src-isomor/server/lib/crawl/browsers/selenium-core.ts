import { Builder, WebDriver } from 'selenium-webdriver';
import * as firefox from 'selenium-webdriver/firefox';
import { error, info } from 'logol';

import { FilePath } from '../../utils';
import { writeFile, outputFile } from 'fs-extra';
import { Crawler } from '../../../typing';
import { injectCodes } from '..';

interface Viewport {
    width: number;
    height: number;
}

export async function startSeleniumCore(
    driver: WebDriver,
    viewport: Viewport,
    filePath: FilePath,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
) {
    try {
        info(`browser open "${url}"`);
        await driver.get(url);

        const html = await driver.getPageSource();
        await writeFile(filePath('html'), html);

        const performance = await driver.executeScript("return window.performance");

        let codeErr: string;
        let links: string[];
        try {
            const injectLinks: string[] = await driver.executeScript("return Array.from(document.links).map(a => a.href)");
            links = await injectCodes(driver, projectId, id, url, injectLinks, distFolder, crawler);
            // console.log('links', links);
        } catch (err) {
            codeErr = err.toString();
            error('Something went wrong while injecting the code', id, url, err);
        }

        const image = await driver.takeScreenshot();
        await outputFile(filePath('png'), Buffer.from(image, 'base64'));
        const png = { width: viewport.width };

        return { links, url, id, performance, png, viewport, error: codeErr };
    } finally {
        await driver.quit();
        info('browser closed', url);
    }
}

export async function getScrollHeightCore(driver: WebDriver, url: string) {
    try {
        await driver.get(url);
        const scrollHeight = await driver.executeScript("return document.body.scrollHeight");
        return scrollHeight as number;
    } finally {
        await driver.quit();
    }
}
