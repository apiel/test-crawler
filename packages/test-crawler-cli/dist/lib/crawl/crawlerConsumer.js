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
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const test_crawler_core_1 = require("test-crawler-core");
const md5 = require("md5");
const crawlPage_1 = require("./crawlPage");
const path_2 = require("../path");
let cachePicker;
exports.consumer = {
    picker: () => __awaiter(void 0, void 0, void 0, function* () {
        if (cachePicker) {
            return cachePicker;
        }
        const data = yield pickFromQueues();
        if (data) {
            const { projectId, id, timestamp } = data;
            const queue = yield getQueue(projectId);
            cachePicker = {
                data,
                apply: () => __awaiter(void 0, void 0, void 0, function* () {
                    logol_1.info('Crawl', { projectId, timestamp, id });
                    yield fs_extra_1.move(path_2.pathQueueFile(projectId, timestamp, id), path_2.pathInfoFile(projectId, timestamp, id));
                    cachePicker = undefined;
                }),
                queue,
            };
            return cachePicker;
        }
    }),
    runner: ({ projectId, id, url, timestamp }) => __awaiter(void 0, void 0, void 0, function* () { return crawlPage_1.loadPage(projectId, id, url, timestamp); }),
};
function pickFromQueue(projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const queueFolder = path_2.pathQueueFolder(projectId, timestamp);
        if (yield fs_extra_1.pathExists(queueFolder)) {
            const [file] = yield fs_extra_1.readdir(queueFolder);
            if (file) {
                try {
                    const queueFile = path_1.join(queueFolder, file);
                    const { id, url } = yield fs_extra_1.readJSON(queueFile);
                    return { projectId, id, url, timestamp };
                }
                catch (error) {
                    logol_1.warn('Crawl possible error', error);
                }
            }
        }
    });
}
function pickFromQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFolders = yield fs_extra_1.readdir(path_2.pathProjectsFolder());
        for (const projectId of projectFolders) {
            const crawlFolder = path_2.pathCrawlFolder(projectId);
            yield fs_extra_1.mkdirp(crawlFolder);
            const timestampFolders = yield fs_extra_1.readdir(crawlFolder);
            for (const timestamp of timestampFolders) {
                const toCrawl = yield pickFromQueue(projectId, timestamp);
                if (toCrawl) {
                    return toCrawl;
                }
            }
        }
    });
}
function getQueue(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { crawlerInput: { browser }, } = yield fs_extra_1.readJSON(path_2.pathProjectFile(projectId));
        if (browser === test_crawler_core_1.Browser.IeSelenium ||
            browser === test_crawler_core_1.Browser.SafariSelenium) {
            return {
                name: `browser-${browser}`,
                maxConcurrent: 1,
            };
        }
        return {
            name: 'browser',
            maxConcurrent: test_crawler_core_1.CONSUMER_COUNT,
        };
    });
}
function pushToCrawl(url, projectId, timestamp, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
        const id = md5(cleanUrl);
        const resultFile = path_2.pathInfoFile(projectId, timestamp, id);
        const queueFile = path_2.pathQueueFile(projectId, timestamp, id);
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
exports.pushToCrawl = pushToCrawl;
function updateSiblingCount(url, projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlPaths = url.split('/').filter(s => s);
        urlPaths.pop();
        const id = md5(urlPaths.join('/'));
        const file = path_2.pathSiblingFile(projectId, timestamp, id);
        let count = 0;
        if (yield fs_extra_1.pathExists(file)) {
            count = parseInt((yield fs_extra_1.readFile(file)).toString(), 10) + 1;
        }
        yield fs_extra_1.outputFile(file, count);
        return count;
    });
}
//# sourceMappingURL=crawlerConsumer.js.map