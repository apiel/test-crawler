import { Builder } from 'selenium-webdriver';
// import * as ie from 'selenium-webdriver/ie';
import { join } from 'path';

import { FilePath } from '../../utils';
import { Crawler } from '../../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';
import { ROOT_FOLDER } from '../../config';

interface Viewport {
    width: number;
    height: number;
}

export async function startSeleniumIE(
    viewport: Viewport,
    filePath: FilePath,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
) {
    const driverPath = join(ROOT_FOLDER, '/Selenium.WebDriver.IEDriver.3.150.0/driver/');
    process.env.PATH = `${process.env.PATH};${driverPath};`;

    // const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder()
        .forBrowser('internet explorer')
        .build();
    // driver.manage().window().setRect({ width: viewport.width, height: scrollHeight, x: 0, y: 0 });
    // driver.manage().window().setRect({ width: 800, height: 1600, x: 0, y: 0 });
    driver.manage().window().setRect({ ...viewport, x: 800, y: 1600 });
    return startSeleniumCore(driver, viewport, filePath, crawler, projectId, id, url, distFolder);
}

async function getScrollHeight(url: string, viewport: Viewport) {
    let driver = await new Builder()
        .forBrowser('internet explorer')
        .build();
    driver.manage().window().setRect({ ...viewport, x: 0, y: 0 });
    return getScrollHeightCore(driver, url);
}
