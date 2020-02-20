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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const minimatch = require("minimatch");
const index_1 = require("../index");
const diff_1 = require("../diff");
const typing_1 = require("../../typing");
const util_1 = require("util");
const CrawlerProvider_1 = require("../CrawlerProvider");
const storage_typing_1 = require("../../storage.typing");
const puppeteer_1 = require("./browsers/puppeteer");
const selenium_firefox_1 = require("./browsers/selenium-firefox");
const selenium_chrome_1 = require("./browsers/selenium-chrome");
const selenium_ie_1 = require("./browsers/selenium-ie");
const selenium_safari_1 = require("./browsers/selenium-safari");
const resultConsumer_1 = require("./resultConsumer");
const startCrawler_1 = require("./startCrawler");
const utils_1 = require("./utils");
function startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url) {
    if (browser === typing_1.Browser.FirefoxSelenium) {
        return selenium_firefox_1.startSeleniumFirefox(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === typing_1.Browser.ChromePuppeteer) {
        return selenium_chrome_1.startSeleniumChrome(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === typing_1.Browser.IeSelenium) {
        return selenium_ie_1.startSeleniumIE(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    else if (browser === typing_1.Browser.SafariSelenium) {
        return selenium_safari_1.startSeleniumSafari(viewport, pngFile, htmlFile, crawler, projectId, id, url);
    }
    return puppeteer_1.startPuppeteer(viewport, pngFile, htmlFile, crawler, projectId, id, url);
}
function loadPage(projectId, id, url, timestamp, done, retry = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonFile = utils_1.pathInfoFile(projectId, timestamp, id);
        const pngFile = utils_1.pathImageFile(projectId, timestamp, id);
        const htmlFile = utils_1.pathSourceFile(projectId, timestamp, id);
        const crawler = yield fs_extra_1.readJSON(utils_1.pathCrawlerFile(projectId, timestamp));
        const { viewport, url: baseUrl, method, limit, browser } = crawler;
        try {
            const _a = yield startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url), { links } = _a, output = __rest(_a, ["links"]);
            yield fs_extra_1.outputJson(jsonFile, output, { spaces: 4 });
            if (method !== index_1.CrawlerMethod.URLs && util_1.isArray(links)) {
                const siteUrls = links.filter(href => href.indexOf(baseUrl) === 0);
                yield addUrls(siteUrls, viewport, projectId, timestamp, limit);
            }
            const result = yield diff_1.prepare(projectId, timestamp, id, crawler);
            resultConsumer_1.pushToResultConsumer({
                result,
                projectId,
                timestamp,
                isError: !!output.error,
            });
        }
        catch (err) {
            logol_1.error(`Load page error (attempt ${retry + 1})`, err.toString());
            if (retry < 2) {
                logol_1.warn('Retry crawl', url);
                yield loadPage(projectId, id, url, timestamp, done, retry + 1);
            }
            else {
                yield fs_extra_1.outputJson(jsonFile, { url, id, error: err.toString() }, { spaces: 4 });
                resultConsumer_1.pushToResultConsumer({
                    projectId,
                    timestamp,
                    isError: true,
                });
            }
        }
        finally {
            done();
        }
    });
}
exports.loadPage = loadPage;
function injectCodes(page, projectId, id, url, links, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new CrawlerProvider_1.CrawlerProvider(storage_typing_1.StorageType.Local);
        const list = yield crawlerProvider.getCodeList(projectId, true);
        const toInject = Object.values(list).filter(({ pattern }) => {
            return minimatch(url, pattern);
        });
        logol_1.info(toInject.length, 'code(s) to inject for', url);
        for (const codeInfo of toInject) {
            const jsFile = utils_1.pathCodeJsFile(projectId, codeInfo.id);
            links = yield injectCode(jsFile, page, id, url, links, crawler);
        }
        return links;
    });
}
exports.injectCodes = injectCodes;
function injectCode(jsFile, page, id, url, links, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(jsFile)) {
            logol_1.info('Inject code', url, links);
            const fn = require(jsFile);
            const newLinks = yield fn(page, url, links, id, crawler);
            return newLinks || links;
        }
        return links;
    });
}
function addUrls(urls, viewport, projectId, timestamp, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        for (const url of urls) {
            if (yield startCrawler_1.addToQueue(url, viewport, projectId, timestamp, limit)) {
                count++;
            }
        }
        if (count > 0) {
            logol_1.info('Add urls', `found ${urls.length}, add ${count}`);
        }
    });
}
