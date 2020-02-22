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
        install('geckodriver');
        // prettier-ignore
        return startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    } else if (browser === Browser.ChromePuppeteer) {
        install('chromedriver');
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

    install('puppeteer');
    const { startPuppeteer } = require('./puppeteer');
    // prettier-ignore
    return startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url);
}

function install(name: string) {
    try {
        require(name);
    } catch (err) {
        try {
            info('Need to install peer dependency', name);
            execSync(`yarn add ${name} --peer`, { stdio: 'inherit' });
            require(name);
        } catch (err2) {
            if (!err2.message.includes(`Cannot find module '${name}'`)) {
                error(
                    'Something went wrong while trying to install peer dependency.',
                    err2,
                );
            }
            error(
                `To run the crawler, some extra package are required. Please install them: yarn add ${name}`,
            );
            process.exit();
        }
    }
}
