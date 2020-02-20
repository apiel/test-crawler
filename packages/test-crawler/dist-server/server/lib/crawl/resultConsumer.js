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
const _1 = require(".");
const config_1 = require("../config");
let totalDiff = 0;
let totalError = 0;
const resultsQueue = [];
function pushToResultConsumer(resultQueue) {
    resultsQueue.push(resultQueue);
}
exports.pushToResultConsumer = pushToResultConsumer;
let consumeResultRetry = 0;
function initConsumeResults(consumeTimeout, push) {
    consumeResultRetry = 0;
    return consumeResults(consumeTimeout, push);
}
exports.initConsumeResults = initConsumeResults;
function consumeResults(consumeTimeout, push) {
    return __awaiter(this, void 0, void 0, function* () {
        if (resultsQueue.length) {
            consumeResultRetry = 0;
            const [{ folder, result, isError }] = resultsQueue.splice(0, 1);
            const file = path_1.join(folder, '_.json');
            const crawler = yield fs_extra_1.readJSON(file);
            if (result) {
                crawler.diffZoneCount += result.diffZoneCount;
                totalDiff += result.diffZoneCount;
            }
            if (isError) {
                crawler.errorCount++;
                totalError++;
            }
            const queueFolder = path_1.join(folder, config_1.QUEUE_FOLDER);
            const filesInQueue = (yield fs_extra_1.pathExists(queueFolder)) ? yield fs_extra_1.readdir(queueFolder) : [];
            crawler.inQueue = filesInQueue.length;
            crawler.urlsCount = (yield fs_extra_1.readdir(folder)).filter(f => path_1.extname(f) === '.json' && f !== '_.json').length;
            crawler.lastUpdate = Date.now();
            yield fs_extra_1.writeJSON(file, crawler, { spaces: 4 });
            push && push(crawler);
            consumeResults(consumeTimeout, push);
        }
        else if (!consumeTimeout || consumeResultRetry < consumeTimeout) {
            consumeResultRetry++;
            setTimeout(() => consumeResults(consumeTimeout, push), 1000);
        }
        else {
            logol_1.info('consumeResults timeout');
            _1.afterAll(totalDiff, totalError);
        }
    });
}
