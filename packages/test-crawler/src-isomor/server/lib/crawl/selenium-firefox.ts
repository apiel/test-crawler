import { Builder } from 'selenium-webdriver';
import * as firefox from 'selenium-webdriver/firefox';
import { error, info } from 'logol';

import { USER_AGENT } from '../config';
import { FilePath } from '../utils';
import { writeFile, outputFile } from 'fs-extra';
import { Crawler } from '../../typing';
import { injectCodes } from '.';

interface Viewport {
    width: number;
    height: number;
}

export async function startSeleniumFirefox(
    viewport: Viewport,
    filePath: FilePath,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
) {
    const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options().headless().windowSize({
            ...viewport,
            height: scrollHeight || viewport.height,
        }).setPreference('general.useragent.override', USER_AGENT))
        .build();
    try {
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

async function getScrollHeight(url: string, viewport: Viewport) {
    let driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options().headless().windowSize(viewport))
        .build();
    try {
        await driver.get(url);
        const scrollHeight = await driver.executeScript("return document.body.scrollHeight");
        return scrollHeight as number;
    } finally {
        await driver.quit();
    }
}
