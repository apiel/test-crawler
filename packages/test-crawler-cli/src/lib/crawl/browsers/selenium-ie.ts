import { Builder } from 'selenium-webdriver';
// import * as ie from 'selenium-webdriver/ie';
import { join } from 'path';

import { Crawler, Viewport } from '../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';
import { ROOT_FOLDER } from '../../config';

export async function startSeleniumIE(
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
) {
    const driverPath = join(
        ROOT_FOLDER,
        '/Selenium.WebDriver.IEDriver.3.150.0/driver/',
    );
    process.env.PATH = `${process.env.PATH};${driverPath};`;

    // const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder().forBrowser('internet explorer').build();
    // driver.manage().window().setRect({ width: viewport.width, height: scrollHeight, x: 0, y: 0 });
    // driver.manage().window().setRect({ width: 800, height: 1600, x: 0, y: 0 });
    driver
        .manage()
        .window()
        .setRect({ ...viewport, x: 0, y: 0 });
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
    let driver = await new Builder().forBrowser('internet explorer').build();
    driver
        .manage()
        .window()
        .setRect({ ...viewport, x: 0, y: 0 });
    return getScrollHeightCore(driver, url);
}
