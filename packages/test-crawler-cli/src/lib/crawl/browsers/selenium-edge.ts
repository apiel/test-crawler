import { Builder } from 'selenium-webdriver';

import { Crawler, Viewport } from '../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';
import { ROOT_FOLDER } from '../../config';
import { join } from 'path';

export async function startSeleniumEdge(
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
) {
    // const driverPath = join(ROOT_FOLDER, '/Selenium.WebDriver.MicrosoftWebDriver.10.0.17134/driver/');
    const driverPath = join(
        ROOT_FOLDER,
        '/Selenium.WebDriver.MicrosoftDriver.17.17134.0/driver/',
    );
    process.env.PATH = `${process.env.PATH};${driverPath};`;

    const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder().forBrowser('MicrosoftEdge').build();
    driver
        .manage()
        .window()
        .setSize(viewport.width, scrollHeight || viewport.height);
    return startSeleniumCore(
        driver,
        viewport,
        pngFile,
        htmlFile,
        crawler,
        projectId,
        id,
        url,
    );
}

async function getScrollHeight(url: string, viewport: Viewport) {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    driver
        .manage()
        .window()
        .setSize(viewport.width, viewport.height);
    return getScrollHeightCore(driver, url);
}
