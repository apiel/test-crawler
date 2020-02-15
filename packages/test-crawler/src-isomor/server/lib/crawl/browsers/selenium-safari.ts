import { Builder } from 'selenium-webdriver';
// import * as safari from 'selenium-webdriver/safari';

import { FilePath } from '../../utils';
import { Crawler } from '../../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';

interface Viewport {
    width: number;
    height: number;
}

export async function startSeleniumSafari(
    viewport: Viewport,
    filePath: FilePath,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
    distFolder: string,
) {
    const driver = await new Builder()
        .forBrowser('safari')
        // .setChromeOptions(new safari.Options().windowSize({
        //     ...viewport,
        //     height: scrollHeight || viewport.height,
        // }).addArguments(`--user-agent=${USER_AGENT}`))
        .build();
    driver.manage().window().maximize();
    // driver.manage().window().setSize(800, 1600);
    driver.manage().window().setRect({ width: 800, height: 1600, x: 0, y: 0 });
    return startSeleniumCore(driver, viewport, filePath, crawler, projectId, id, url, distFolder);
}

// to take full page screen, we could scroll down and take multiple screenshot, then combine them
// but it might be tricky for website with afix
