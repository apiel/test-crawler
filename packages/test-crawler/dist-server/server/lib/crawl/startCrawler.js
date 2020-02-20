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
const index_1 = require("../index");
const CrawlerProvider_1 = require("../CrawlerProvider");
const axios_1 = require("axios");
const md5 = require("md5");
const storage_typing_1 = require("../../storage.typing");
const utils_1 = require("./utils");
function startCrawler({ projectId, timestamp }) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new CrawlerProvider_1.CrawlerProvider(storage_typing_1.StorageType.Local);
        const { crawlerInput } = yield crawlerProvider.loadProject(projectId);
        const id = md5(`${timestamp}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);
        const crawler = Object.assign(Object.assign({}, crawlerInput), { timestamp,
            id, diffZoneCount: 0, errorCount: 0, status: 'review', inQueue: 1, urlsCount: 0, startAt: Date.now(), lastUpdate: Date.now() });
        yield fs_extra_1.outputJSON(utils_1.pathCrawlerFile(projectId, timestamp), crawler, { spaces: 4 });
        if (crawlerInput.method === index_1.CrawlerMethod.URLs) {
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
            throw (new Error('Something went wrong while adding job to queue'));
        }
    });
}
function addToQueue(url, viewport, projectId, timestamp, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
        const id = md5(`${cleanUrl}-${JSON.stringify(viewport)}`);
        const resultFile = utils_1.pathInfoFile(projectId, timestamp, id);
        const queueFile = utils_1.pathQueueFile(projectId, timestamp, id);
        if (!(yield fs_extra_1.pathExists(queueFile)) && !(yield fs_extra_1.pathExists(resultFile))) {
            if (!limit || (yield updateSiblingCount(cleanUrl, projectId, timestamp)) < limit) {
                yield fs_extra_1.outputJson(queueFile, { url: cleanUrl, id }, { spaces: 4 });
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
        const file = utils_1.pathSiblingFile(projectId, timestamp, id);
        let count = 0;
        if (yield fs_extra_1.pathExists(file)) {
            count = parseInt((yield fs_extra_1.readFile(file)).toString(), 10) + 1;
        }
        yield fs_extra_1.outputFile(file, count);
        return count;
    });
}
