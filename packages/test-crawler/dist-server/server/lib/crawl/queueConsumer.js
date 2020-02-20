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
const config_1 = require("../config");
const typing_1 = require("../../typing");
const crawlPage_1 = require("./crawlPage");
;
let consumerRunning = 0;
let consumerMaxCount = config_1.CONSUMER_COUNT;
function setConsumerMaxCount(crawlTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        const { crawlerInput: { browser } } = yield fs_extra_1.readJSON(path_1.join(config_1.ROOT_FOLDER, config_1.PROJECT_FOLDER, crawlTarget.projectId, 'project.json'));
        if (browser === typing_1.Browser.IeSelenium
            || browser === typing_1.Browser.SafariSelenium) {
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
        const distFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp);
        const queueFolder = path_1.join(distFolder, config_1.QUEUE_FOLDER);
        if (yield fs_extra_1.pathExists(queueFolder)) {
            const [file] = yield fs_extra_1.readdir(queueFolder);
            if (file) {
                logol_1.info('Crawl', file);
                try {
                    const queueFile = path_1.join(queueFolder, file);
                    const { id, url } = yield fs_extra_1.readJSON(queueFile);
                    yield fs_extra_1.move(queueFile, path_1.join(distFolder, `${id}.json`));
                    return { projectId, id, url, distFolder };
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
        const projectFolders = yield fs_extra_1.readdir(config_1.PROJECT_FOLDER);
        for (const projectId of projectFolders) {
            const crawlFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER);
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
let consumeQueuesRetry = 0;
function initConsumeQueues(consumeTimeout, crawlTarget) {
    consumeQueuesRetry = 0;
    return consumeQueues(consumeTimeout, crawlTarget);
}
exports.initConsumeQueues = initConsumeQueues;
function consumeQueues(consumeTimeout, crawlTarget) {
    return __awaiter(this, void 0, void 0, function* () {
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
                const { projectId, id, url, distFolder } = toCrawl;
                consumerRunning++;
                crawlPage_1.loadPage(projectId, id, url, distFolder, () => consumerRunning--);
                consumeQueues(consumeTimeout, crawlTarget);
                return;
            }
        }
        if (!consumeTimeout || consumeQueuesRetry < consumeTimeout) {
            if (consumerRunning < getConsumerMaxCount()) {
                consumeQueuesRetry++;
            }
            setTimeout(() => consumeQueues(consumeTimeout, crawlTarget), 500);
        }
        else {
            logol_1.info('consumeQueues timeout');
        }
    });
}
