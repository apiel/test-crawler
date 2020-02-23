"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_crawler_core_1 = require("test-crawler-core");
const selenium_firefox_1 = require("./selenium-firefox");
const selenium_chrome_1 = require("./selenium-chrome");
const selenium_ie_1 = require("./selenium-ie");
const selenium_safari_1 = require("./selenium-safari");
function startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url) {
    if (browser === test_crawler_core_1.Browser.FirefoxSelenium) {
        return selenium_firefox_1.startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === test_crawler_core_1.Browser.ChromePuppeteer) {
        return selenium_chrome_1.startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === test_crawler_core_1.Browser.IeSelenium) {
        return selenium_ie_1.startSeleniumIE(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === test_crawler_core_1.Browser.SafariSelenium) {
        return selenium_safari_1.startSeleniumSafari(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    const { startPuppeteer } = require('./puppeteer');
    return startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url);
}
exports.startBrowser = startBrowser;
//# sourceMappingURL=browser.js.map