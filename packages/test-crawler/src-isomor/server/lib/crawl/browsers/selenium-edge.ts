import { Builder } from 'selenium-webdriver';

import { FilePath } from '../../utils';
import { Crawler } from '../../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';
import { ROOT_FOLDER } from '../../config';
import { join } from 'path';

interface Viewport {
    width: number;
    height: number;
}

export async function startSeleniumEdge(
    viewport: Viewport,
    filePath: FilePath,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
) {
    const driverPath = join(ROOT_FOLDER, '/Selenium.WebDriver.MicrosoftWebDriver.10.0.17134/driver/');
    process.env.PATH = `${process.env.PATH};${driverPath};`;

    const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .build();
    driver.manage().window().setSize(viewport.width, scrollHeight || viewport.height);
    return startSeleniumCore(driver, viewport, filePath, crawler, projectId, id, url, distFolder);
}

async function getScrollHeight(url: string, viewport: Viewport) {
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .build();
    driver.manage().window().setSize(viewport.width, viewport.height);
    return getScrollHeightCore(driver, url);
}
