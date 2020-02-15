import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

import { USER_AGENT } from '../config';
import { FilePath } from '../utils';
import { Crawler } from '../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';

interface Viewport {
    width: number;
    height: number;
}

export async function startSeleniumChrome(
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
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize({
            ...viewport,
            height: scrollHeight || viewport.height,
        }).addArguments(`--user-agent=${USER_AGENT}`))
        .build();
    return startSeleniumCore(driver, viewport, filePath, crawler, projectId, id, url, distFolder);
}

async function getScrollHeight(url: string, viewport: Viewport) {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize(viewport))
        .build();
    return getScrollHeightCore(driver, url);
}
