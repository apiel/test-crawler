import { Builder } from 'selenium-webdriver';
// import * as safari from 'selenium-webdriver/safari';
import { Crawler, Viewport } from 'test-crawler-core';

import { startSeleniumCore, getScrollHeightCore } from './selenium-core';

export async function startSeleniumSafari(
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
) {
    const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder().forBrowser('safari').build();
    driver
        .manage()
        .window()
        .setRect({ width: viewport.width, height: scrollHeight, x: 0, y: 0 });
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
    let driver = await new Builder().forBrowser('safari').build();
    driver
        .manage()
        .window()
        .setRect({ ...viewport, x: 0, y: 0 });
    return getScrollHeightCore(driver, url);
}
