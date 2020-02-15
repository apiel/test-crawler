import { Builder } from 'selenium-webdriver';
import * as edge from 'selenium-webdriver/edge';
import * as edgedriver from 'edgedriver';

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
    const service = await new edge.ServiceBuilder(edgedriver.path);

    const scrollHeight = await getScrollHeight(url, viewport, service);
    const driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(service)
        .build();
    driver.manage().window().setSize(viewport.width, scrollHeight || viewport.height);
    return startSeleniumCore(driver, viewport, filePath, crawler, projectId, id, url, distFolder);
}

async function getScrollHeight(url: string, viewport: Viewport, service: any) {
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(service)
        .build();
    driver.manage().window().setSize(viewport.width, viewport.height);
    return getScrollHeightCore(driver, url);
}
