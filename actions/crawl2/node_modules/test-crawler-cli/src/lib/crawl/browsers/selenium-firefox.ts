import { Builder } from 'selenium-webdriver';
import * as firefox from 'selenium-webdriver/firefox';
import { USER_AGENT, Crawler, Viewport } from 'test-crawler-core';

import { startSeleniumCore, getScrollHeightCore } from './selenium-core';

export async function startSeleniumFirefox(
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
        .forBrowser('firefox')
        .setFirefoxOptions(
            new firefox.Options()
                .headless()
                .windowSize({
                    ...viewport,
                    height: scrollHeight || viewport.height,
                })
                .setPreference('general.useragent.override', USER_AGENT),
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
        .forBrowser('firefox')
        .setFirefoxOptions(
            new firefox.Options().headless().windowSize(viewport),
        )
        .build();
    return getScrollHeightCore(driver, url);
}
