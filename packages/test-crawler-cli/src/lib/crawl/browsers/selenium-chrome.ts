import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { USER_AGENT, Crawler, Viewport } from 'test-crawler-core';

import { startSeleniumCore, getScrollHeightCore } from './selenium-core';

export async function startSeleniumChrome(
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
) {
    const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options()
                .headless()
                .windowSize({
                    ...viewport,
                    height: scrollHeight || viewport.height,
                })
                .addArguments(`--user-agent=${USER_AGENT}`),
        )
        .build();
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
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize(viewport))
        .build();
    return getScrollHeightCore(driver, url);
}
