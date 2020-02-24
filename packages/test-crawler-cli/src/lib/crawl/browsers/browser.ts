import { Crawler, Browser, Viewport } from 'test-crawler-core';
import { driver, DriverType } from 'test-crawler-driver-manager';

import { startSeleniumFirefox } from './selenium-firefox';
import { startSeleniumChrome } from './selenium-chrome';
import { startSeleniumIE } from './selenium-ie';
// import { startSeleniumEdge } from './selenium-edge';
import { startSeleniumSafari } from './selenium-safari';

export async function startBrowser(
    browser: Browser,
    viewport: Viewport,
    pngFile: string,
    htmlFile: string,
    crawler: Crawler,
    projectId: string,
    id: string,
    url: string,
) {
    if (browser === Browser.FirefoxSelenium) {
        // prettier-ignore
        return startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    } else if (browser === Browser.ChromeSelenium) {
        // prettier-ignore
        return startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    } else if (browser === Browser.IeSelenium) {
        // prettier-ignore
        return startSeleniumIE(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    // else if (browser === Browser.EdgeSelenium) {
    //     // prettier-ignore
    //     return startSeleniumEdge(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    // }
    else if (browser === Browser.SafariSelenium) {
        // prettier-ignore
        return startSeleniumSafari(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }

    const { startPuppeteer } = require('./puppeteer');
    // prettier-ignore
    return startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url);
}

export function installDriver(browser: Browser) {
    if (browser === Browser.FirefoxSelenium) {
        return installDriverCache(DriverType.Gecko);
    } else if (browser === Browser.ChromeSelenium) {
        return installDriverCache(DriverType.Chrome);
    } else if (browser === Browser.IeSelenium) {
        return installDriverCache(DriverType.IE);
    }
}

const installDriverHistory = [];
function installDriverCache(type: DriverType) {
    if (!installDriverHistory.includes(type)) {
        installDriverHistory.push(type);
        return driver(type);
    }
}
