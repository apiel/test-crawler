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
const _1 = require(".");
const path_2 = require("../path");
const queueConsumer_1 = require("./queueConsumer");
let totalDiff = 0;
let totalError = 0;
let consumeResultRetry = 0;
let consumerIsRunning = false;
const resultsQueue = [];
function pushToResultConsumer(resultQueue, push) {
    resultsQueue.push(resultQueue);
    runResultsConsumer(push);
}
exports.pushToResultConsumer = pushToResultConsumer;
function runResultsConsumer(push) {
    if (!consumerIsRunning) {
        consumeResultRetry = 0;
        consumeResults(push);
    }
}
exports.runResultsConsumer = runResultsConsumer;
function consumeResults(push) {
    return __awaiter(this, void 0, void 0, function* () {
        consumerIsRunning = true;
        if (resultsQueue.length) {
            consumeResultRetry = 0;
            const [{ projectId, timestamp, result, isError }] = resultsQueue.splice(0, 1);
            const crawlerFile = path_2.pathCrawlerFile(projectId, timestamp);
            const crawler = yield fs_extra_1.readJSON(crawlerFile);
            if (result) {
                crawler.diffZoneCount += result.diffZoneCount;
                totalDiff += result.diffZoneCount;
            }
            if (isError) {
                crawler.errorCount++;
                totalError++;
            }
            const queueFolder = path_2.pathQueueFolder(projectId, timestamp);
            const filesInQueue = (yield fs_extra_1.pathExists(queueFolder))
                ? yield fs_extra_1.readdir(queueFolder)
                : [];
            crawler.inQueue = filesInQueue.length;
            crawler.urlsCount = (yield fs_extra_1.readdir(path_2.pathResultFolder(projectId, timestamp))).filter(f => path_1.extname(f) === '.json' && f !== '_.json').length;
            crawler.lastUpdate = Date.now();
            yield fs_extra_1.writeJSON(crawlerFile, crawler, { spaces: 4 });
            push && push(crawler);
            consumeResults(push);
        }
        else if (!test_crawler_core_1.CONSUME_TIMEOUT || consumeResultRetry < test_crawler_core_1.CONSUME_TIMEOUT) {
            consumeResultRetry++;
            setTimeout(() => consumeResults(push), 1000);
        }
        else {
            consumerIsRunning = false;
            logol_1.info('consumeResults timeout');
            if (!queueConsumer_1.isQueuesConsumerRunning()) {
                _1.afterAll(totalDiff, totalError);
            }
        }
    });
}
//# sourceMappingURL=resultConsumer.js.map