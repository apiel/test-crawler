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
const fs_extra_1 = require("fs-extra");
const test_crawler_core_1 = require("test-crawler-core");
const axios_1 = require("axios");
const md5 = require("md5");
const path_1 = require("../path");
const browser_1 = require("./browsers/browser");
function startCrawler({ projectId, timestamp }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { crawlerInput } = yield fs_extra_1.readJSON(path_1.pathProjectFile(projectId));
        const id = md5(`${timestamp}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);
        yield fs_extra_1.mkdirp(path_1.pathSnapshotFolder(projectId));
        const crawler = Object.assign(Object.assign({}, crawlerInput), { timestamp,
            id, diffZoneCount: 0, errorCount: 0, status: 'review', inQueue: 1, urlsCount: 0, startAt: Date.now(), lastUpdate: Date.now() });
        yield browser_1.installDriver(crawler.browser);
        yield fs_extra_1.outputJSON(path_1.pathCrawlerFile(projectId, timestamp), crawler, {
            spaces: 4,
        });
        if (crawlerInput.method === test_crawler_core_1.CrawlerMethod.URLs) {
            yield startUrlsCrawling(crawlerInput, projectId, timestamp);
        }
        else {
            yield startSpiderBotCrawling(crawlerInput, projectId, timestamp);
        }
    });
}
exports.startCrawler = startCrawler;
function startUrlsCrawling(crawlerInput, projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(crawlerInput.url);
        const urls = data.split(`\n`).filter((url) => url.trim());
        yield Promise.all(urls.map((url) => addToQueue(url, crawlerInput.viewport, projectId, timestamp)));
    });
}
function startSpiderBotCrawling({ url, viewport, limit }, projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const addedToqueue = yield addToQueue(url, viewport, projectId, timestamp, limit);
        if (!addedToqueue) {
            throw new Error('Something went wrong while adding job to queue');
        }
    });
}
function addToQueue(url, viewport, projectId, timestamp, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
        const id = md5(`${cleanUrl}-${JSON.stringify(viewport)}`);
        const resultFile = path_1.pathInfoFile(projectId, timestamp, id);
        const queueFile = path_1.pathQueueFile(projectId, timestamp, id);
        if (!(yield fs_extra_1.pathExists(queueFile)) && !(yield fs_extra_1.pathExists(resultFile))) {
            if (!limit ||
                (yield updateSiblingCount(cleanUrl, projectId, timestamp)) < limit) {
                yield fs_extra_1.outputJSON(queueFile, { url: cleanUrl, id }, { spaces: 4 });
            }
            return true;
        }
        return false;
    });
}
exports.addToQueue = addToQueue;
function updateSiblingCount(url, projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlPaths = url.split('/').filter(s => s);
        urlPaths.pop();
        const id = md5(urlPaths.join('/'));
        const file = path_1.pathSiblingFile(projectId, timestamp, id);
        let count = 0;
        if (yield fs_extra_1.pathExists(file)) {
            count = parseInt((yield fs_extra_1.readFile(file)).toString(), 10) + 1;
        }
        yield fs_extra_1.outputFile(file, count);
        return count;
    });
}
//# sourceMappingURL=startCrawler.js.map