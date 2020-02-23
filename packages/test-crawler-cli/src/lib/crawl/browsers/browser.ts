import { Crawler, Browser, Viewport } from 'test-crawler-core';
import { execSync } from 'child_process';
import { error, info } from 'logol';

import { startSeleniumFirefox } from './selenium-firefox';
import { startSeleniumChrome } from './selenium-chrome';
import { startSeleniumIE } from './selenium-ie';
// import { startSeleniumEdge } from './selenium-edge';
import { startSeleniumSafari } from './selenium-safari';

export function startBrowser(
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
    } else if (browser === Browser.ChromePuppeteer) {
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
