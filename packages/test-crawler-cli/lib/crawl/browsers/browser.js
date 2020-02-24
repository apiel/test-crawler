"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_crawler_core_1 = require("test-crawler-core");
const test_crawler_driver_manager_1 = require("test-crawler-driver-manager");
const selenium_firefox_1 = require("./selenium-firefox");
const selenium_chrome_1 = require("./selenium-chrome");
const selenium_ie_1 = require("./selenium-ie");
const selenium_safari_1 = require("./selenium-safari");
function startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (browser === test_crawler_core_1.Browser.FirefoxSelenium) {
            yield installDriver(test_crawler_driver_manager_1.DriverType.Gecko);
            return selenium_firefox_1.startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url);
        }
        else if (browser === test_crawler_core_1.Browser.ChromeSelenium) {
            yield installDriver(test_crawler_driver_manager_1.DriverType.Chrome);
            return selenium_chrome_1.startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url);
        }
        else if (browser === test_crawler_core_1.Browser.IeSelenium) {
            yield installDriver(test_crawler_driver_manager_1.DriverType.IE);
            return selenium_ie_1.startSeleniumIE(viewport, pngFile, htmlFile, crawler, projectId, id, url);
        }
        else if (browser === test_crawler_core_1.Browser.SafariSelenium) {
            return selenium_safari_1.startSeleniumSafari(viewport, pngFile, htmlFile, crawler, projectId, id, url);
        }
        const { startPuppeteer } = require('./puppeteer');
        return startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    });
}
exports.startBrowser = startBrowser;
const installDriverHistory = [];
function installDriver(type) {
    if (!installDriverHistory.includes(type)) {
        installDriverHistory.push(type);
        return test_crawler_driver_manager_1.driver(type);
    }
}
//# sourceMappingURL=browser.js.map