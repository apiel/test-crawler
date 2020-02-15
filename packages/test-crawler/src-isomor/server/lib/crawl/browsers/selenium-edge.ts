import { Builder } from 'selenium-webdriver';
// import * as edge from 'selenium-webdriver/edge';

import { FilePath } from '../../utils';
import { Crawler } from '../../../typing';
import { startSeleniumCore, getScrollHeightCore } from './selenium-core';

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
    const scrollHeight = await getScrollHeight(url, viewport);
    const driver = await new Builder()
        .forBrowser('edge')
        // .setChromeOptions(
        //     new edge.Options()
        //         .windowSize({
        //             ...viewport,
        //             height: scrollHeight || viewport.height,
        //         })
        // )
        .build();
    driver.manage().window().setSize(viewport.width, scrollHeight || viewport.height);
    return startSeleniumCore(driver, viewport, filePath, crawler, projectId, id, url, distFolder);
}

async function getScrollHeight(url: string, viewport: Viewport) {
    let driver = await new Builder()
        .forBrowser('edge')
        // .setChromeOptions(new ie.Options().windowSize(viewport))
        .build();
    driver.manage().window().setSize(viewport.width, viewport.height);
    return getScrollHeightCore(driver, url);
}
