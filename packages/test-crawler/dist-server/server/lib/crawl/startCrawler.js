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
const path_1 = require("path");
const config_1 = require("../config");
const index_1 = require("../index");
const CrawlerProvider_1 = require("../CrawlerProvider");
const axios_1 = require("axios");
const md5 = require("md5");
const storage_typing_1 = require("../../storage.typing");
function startCrawler({ projectId, timestamp }) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new CrawlerProvider_1.CrawlerProvider(storage_typing_1.StorageType.Local);
        const { crawlerInput } = yield crawlerProvider.loadProject(projectId);
        const id = md5(`${timestamp}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);
        const crawler = Object.assign(Object.assign({}, crawlerInput), { timestamp,
            id, diffZoneCount: 0, errorCount: 0, status: 'review', inQueue: 1, urlsCount: 0, startAt: Date.now(), lastUpdate: Date.now() });
        const distFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp);
        yield fs_extra_1.outputJSON(path_1.join(distFolder, '_.json'), crawler, { spaces: 4 });
        if (crawlerInput.method === index_1.CrawlerMethod.URLs) {
            yield startUrlsCrawling(crawlerInput, distFolder);
        }
        else {
            yield startSpiderBotCrawling(crawlerInput, distFolder);
        }
    });
}
exports.startCrawler = startCrawler;
function startUrlsCrawling(crawlerInput, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(crawlerInput.url);
        const urls = data.split(`\n`).filter((url) => url.trim());
        yield Promise.all(urls.map((url) => addToQueue(url, crawlerInput.viewport, distFolder)));
    });
}
function startSpiderBotCrawling({ url, viewport, limit }, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const addedToqueue = yield addToQueue(url, viewport, distFolder, limit);
        if (!addedToqueue) {
            throw (new Error('Something went wrong while adding job to queue'));
        }
    });
}
function addToQueue(url, viewport, distFolder, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
        const id = md5(`${cleanUrl}-${JSON.stringify(viewport)}`);
        const resultFile = path_1.join(distFolder, `${id}.json`);
        const queueFile = path_1.join(distFolder, config_1.QUEUE_FOLDER, `${id}.json`);
        if (!(yield fs_extra_1.pathExists(queueFile)) && !(yield fs_extra_1.pathExists(resultFile))) {
            if (!limit || (yield updateSiblingCount(cleanUrl, distFolder)) < limit) {
                yield fs_extra_1.outputJson(queueFile, { url: cleanUrl, id }, { spaces: 4 });
            }
            return true;
        }
        return false;
    });
}
exports.addToQueue = addToQueue;
function updateSiblingCount(url, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlPaths = url.split('/').filter(s => s);
        urlPaths.pop();
        const id = md5(urlPaths.join('/'));
        const file = path_1.join(distFolder, 'sibling', id);
        let count = 0;
        if (yield fs_extra_1.pathExists(file)) {
            count = parseInt((yield fs_extra_1.readFile(file)).toString(), 10) + 1;
        }
        yield fs_extra_1.outputFile(file, count);
        return count;
    });
}
