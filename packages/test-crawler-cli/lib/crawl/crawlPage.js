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
const util_1 = require("util");
const test_crawler_core_1 = require("test-crawler-core");
const diff_1 = require("../diff");
const utils_1 = require("../utils");
const resultConsumer_1 = require("./resultConsumer");
const browser_1 = require("./browsers/browser");
const path_1 = require("../path");
const crawlerConsumer_1 = require("./crawlerConsumer");
function loadPage(projectId, id, url, timestamp, retry = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonFile = path_1.pathInfoFile(projectId, timestamp, id);
        const pngFile = path_1.pathImageFile(projectId, timestamp, id);
        const htmlFile = path_1.pathSourceFile(projectId, timestamp, id);
        const crawler = yield fs_extra_1.readJSON(path_1.pathCrawlerFile(projectId, timestamp));
        const { viewport, url: baseUrl, method, limit, browser } = crawler;
        try {
            const _a = yield browser_1.startBrowser(browser, viewport, pngFile, htmlFile, crawler, projectId, id, url), { links } = _a, output = __rest(_a, ["links"]);
            yield fs_extra_1.outputJson(jsonFile, Object.assign(Object.assign({}, output), { timestamp }), { spaces: 4 });
            if (method !== test_crawler_core_1.CrawlerMethod.URLs && util_1.isArray(links)) {
                const siteUrls = links.filter(href => href.indexOf(baseUrl) === 0);
                yield addUrls(siteUrls, projectId, timestamp, limit);
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
                yield loadPage(projectId, id, url, timestamp, retry + 1);
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
    });
}
exports.loadPage = loadPage;
function injectCodes(page, projectId, id, url, links, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield utils_1.getCodeList(projectId);
        const toInject = Object.values(list).filter(({ pattern }) => {
            return minimatch(url, pattern);
        });
        logol_1.info(toInject.length, 'code(s) to inject for', url);
        for (const codeInfo of toInject) {
            const jsFile = path_1.pathCodeJsFile(projectId, codeInfo.id);
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
function addUrls(urls, projectId, timestamp, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        for (const url of urls) {
            if (yield crawlerConsumer_1.pushToCrawl(url, projectId, timestamp, limit)) {
                count++;
            }
        }
        if (count > 0) {
            logol_1.info('Add urls', `found ${urls.length}, add ${count}`);
        }
    });
}
//# sourceMappingURL=crawlPage.js.map