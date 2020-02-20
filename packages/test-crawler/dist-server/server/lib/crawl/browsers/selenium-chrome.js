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
const chrome = require("selenium-webdriver/chrome");
const config_1 = require("../../config");
const selenium_core_1 = require("./selenium-core");
function startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const scrollHeight = yield getScrollHeight(url, viewport);
        const driver = yield new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless().windowSize(Object.assign(Object.assign({}, viewport), { height: scrollHeight || viewport.height })).addArguments(`--user-agent=${config_1.USER_AGENT}`))
            .build();
        return selenium_core_1.startSeleniumCore(driver, viewport, pngFile, htmlFile, crawler, projectId, id, url);
    });
}
exports.startSeleniumChrome = startSeleniumChrome;
function getScrollHeight(url, viewport) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver = yield new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless().windowSize(viewport))
            .build();
        return selenium_core_1.getScrollHeightCore(driver, url);
    });
}
