"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_crawler_core_1 = require("test-crawler-core");
const child_process_1 = require("child_process");
const logol_1 = require("logol");
const selenium_firefox_1 = require("./selenium-firefox");
const selenium_chrome_1 = require("./selenium-chrome");
const selenium_ie_1 = require("./selenium-ie");
const selenium_safari_1 = require("./selenium-safari");
function startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url) {
    if (browser === test_crawler_core_1.Browser.FirefoxSelenium) {
        install('geckodriver');
        return selenium_firefox_1.startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === test_crawler_core_1.Browser.ChromePuppeteer) {
        install('chromedriver');
        return selenium_chrome_1.startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === test_crawler_core_1.Browser.IeSelenium) {
        return selenium_ie_1.startSeleniumIE(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === test_crawler_core_1.Browser.SafariSelenium) {
        return selenium_safari_1.startSeleniumSafari(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    install('puppeteer');
    const { startPuppeteer } = require('./puppeteer');
    return startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url);
}
exports.startBrowser = startBrowser;
function install(name) {
    try {
        require(name);
    }
    catch (err) {
        try {
            logol_1.info('Need to install peer dependency', name);
            child_process_1.execSync(`yarn add ${name} --peer`, { stdio: 'inherit' });
            require(name);
        }
        catch (err2) {
            if (!err2.message.includes(`Cannot find module '${name}'`)) {
                logol_1.error('Something went wrong while trying to install peer dependency.', err2);
            }
            logol_1.error(`To run the crawler, some extra package are required. Please install them: yarn add ${name}`);
            process.exit();
        }
    }
}
//# sourceMappingURL=index.js.map