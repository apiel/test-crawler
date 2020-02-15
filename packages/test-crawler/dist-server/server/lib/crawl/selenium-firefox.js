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
const selenium_webdriver_1 = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const logol_1 = require("logol");
const config_1 = require("../config");
const fs_extra_1 = require("fs-extra");
const _1 = require(".");
function startSeleniumFirefox(viewport, filePath, crawler, projectId, id, url, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const scrollHeight = yield getScrollHeight(url, viewport);
        const driver = yield new selenium_webdriver_1.Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless().windowSize(Object.assign(Object.assign({}, viewport), { height: scrollHeight || viewport.height })).setPreference('general.useragent.override', config_1.USER_AGENT))
            .build();
        try {
            yield driver.get(url);
            const html = yield driver.getPageSource();
            yield fs_extra_1.writeFile(filePath('html'), html);
            const performance = yield driver.executeScript("return window.performance");
            let codeErr;
            let links;
            try {
                const injectLinks = yield driver.executeScript("return Array.from(document.links).map(a => a.href)");
                links = yield _1.injectCodes(driver, projectId, id, url, injectLinks, distFolder, crawler);
            }
            catch (err) {
                codeErr = err.toString();
                logol_1.error('Something went wrong while injecting the code', id, url, err);
            }
            const image = yield driver.takeScreenshot();
            yield fs_extra_1.outputFile(filePath('png'), Buffer.from(image, 'base64'));
            const png = { width: viewport.width };
            return { links, url, id, performance, png, viewport, error: codeErr };
        }
        finally {
            yield driver.quit();
            logol_1.info('browser closed', url);
        }
    });
}
exports.startSeleniumFirefox = startSeleniumFirefox;
function getScrollHeight(url, viewport) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver = yield new selenium_webdriver_1.Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless().windowSize(viewport))
            .build();
        try {
            yield driver.get(url);
            const scrollHeight = yield driver.executeScript("return document.body.scrollHeight");
            return scrollHeight;
        }
        finally {
            yield driver.quit();
        }
    });
}
