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
const crawlPage_1 = require("./crawlPage");
const path_2 = require("../path");
let consumerRunning = 0;
let consumerMaxCount = test_crawler_core_1.CONSUMER_COUNT;
function setConsumerMaxCount({ projectId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { crawlerInput: { browser }, } = yield fs_extra_1.readJSON(path_2.pathProjectFile(projectId));
        if (browser === test_crawler_core_1.Browser.IeSelenium ||
            browser === test_crawler_core_1.Browser.SafariSelenium) {
            consumerMaxCount = 1;
        }
        logol_1.info('Max consumer', consumerMaxCount);
    });
}
exports.setConsumerMaxCount = setConsumerMaxCount;
function getConsumerMaxCount() {
    return consumerMaxCount;
}
function pickFromQueue(projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const queueFolder = path_2.pathQueueFolder(projectId, timestamp);
        if (yield fs_extra_1.pathExists(queueFolder)) {
            const [file] = yield fs_extra_1.readdir(queueFolder);
            if (file) {
                logol_1.info('Crawl', file);
                try {
                    const queueFile = path_1.join(queueFolder, file);
                    const { id, url } = yield fs_extra_1.readJSON(queueFile);
                    yield fs_extra_1.move(queueFile, path_2.pathInfoFile(projectId, timestamp, id));
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
        const projectFolders = yield fs_extra_1.readdir(test_crawler_core_1.PROJECT_FOLDER);
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
let consumerIsRunning = false;
let consumeQueuesRetry = 0;
function runQueuesConsumer(crawlTarget) {
    if (consumerRunning < getConsumerMaxCount()) {
        consumeQueuesRetry = 0;
        return consumeQueues(crawlTarget);
    }
}
exports.runQueuesConsumer = runQueuesConsumer;
function consumeQueues(crawlTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        consumerIsRunning = true;
        if (consumerRunning < getConsumerMaxCount()) {
            let toCrawl;
            if (crawlTarget) {
                toCrawl = yield pickFromQueue(crawlTarget.projectId, crawlTarget.timestamp);
            }
            else {
                toCrawl = yield pickFromQueues();
            }
            if (toCrawl) {
                consumeQueuesRetry = 0;
                const { projectId, id, url, timestamp } = toCrawl;
                consumerRunning++;
                crawlPage_1.loadPage(projectId, id, url, timestamp, () => consumerRunning--);
                consumeQueues(crawlTarget);
                return;
            }
        }
        if (!test_crawler_core_1.CONSUME_TIMEOUT || consumeQueuesRetry < test_crawler_core_1.CONSUME_TIMEOUT) {
            if (consumerRunning < getConsumerMaxCount()) {
                consumeQueuesRetry++;
            }
            setTimeout(() => consumeQueues(crawlTarget), 500);
        }
        else {
            consumerIsRunning = false;
            logol_1.info('consumeQueues timeout');
        }
    });
}
function isQueuesConsumerRunning() {
    return consumerIsRunning;
}
exports.isQueuesConsumerRunning = isQueuesConsumerRunning;
//# sourceMappingURL=queueConsumer.js.map