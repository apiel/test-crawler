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
const util_1 = require("util");
const rimraf = require("rimraf");
const config_1 = require("../config");
const resultConsumer_1 = require("./resultConsumer");
const queueConsumer_1 = require("./queueConsumer");
const startCrawler_1 = require("./startCrawler");
const path_2 = require("../path");
let projectIdForExit;
function beforeAll(crawlTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        if (crawlTarget) {
            try {
                projectIdForExit = crawlTarget.projectId;
                const jsFile = path_1.join(config_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, crawlTarget.projectId, 'before.js');
                if (yield fs_extra_1.pathExists(jsFile)) {
                    const fn = require(jsFile);
                    yield fn();
                }
            }
            catch (err) {
                logol_1.error('Something went wrong in beforeAll script', err);
            }
        }
    });
}
function afterAll(totalDiff, totalError) {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Done', { totalDiff, totalError });
        if (projectIdForExit) {
            try {
                const jsFile = path_1.join(config_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectIdForExit, 'after.js');
                if (yield fs_extra_1.pathExists(jsFile)) {
                    const fn = require(jsFile);
                    fn(totalDiff, totalError);
                }
            }
            catch (err) {
                logol_1.error('Something went wrong in afterAll script', err);
            }
        }
    });
}
exports.afterAll = afterAll;
function prepareFolders() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(test_crawler_core_1.PROJECT_FOLDER))) {
            yield fs_extra_1.mkdirp(test_crawler_core_1.PROJECT_FOLDER);
        }
        return cleanHistory();
    });
}
function cleanHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const projects = yield fs_extra_1.readdir(test_crawler_core_1.PROJECT_FOLDER);
        for (const project of projects) {
            const crawlFolder = path_1.join(test_crawler_core_1.PROJECT_FOLDER, project, test_crawler_core_1.CRAWL_FOLDER);
            if (yield fs_extra_1.pathExists(crawlFolder)) {
                const results = yield fs_extra_1.readdir(crawlFolder);
                const cleanUp = results.slice(0, -(test_crawler_core_1.MAX_HISTORY - 1));
                for (const toRemove of cleanUp) {
                    yield util_1.promisify(rimraf)(path_1.join(crawlFolder, toRemove));
                }
                yield cleanSnapshot(project);
            }
        }
    });
}
function cleanSnapshot(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshotFolder = path_2.pathSnapshotFolder(projectId);
        if (yield fs_extra_1.pathExists(snapshotFolder)) {
            const files = yield fs_extra_1.readdir(snapshotFolder);
            for (const file of files) {
                const [timestamp, id] = path_1.basename(file, path_1.extname(file)).split('-');
                const infoFile = path_2.pathInfoFile(projectId, timestamp, id);
                if (!(yield fs_extra_1.pathExists(infoFile))) {
                    const pinFile = path_2.pathPinInfoFile(projectId, id);
                    if (!(yield fs_extra_1.pathExists(pinFile))) {
                        logol_1.info('Remove unused snapshot', snapshotFolder, file);
                        yield fs_extra_1.remove(path_1.join(snapshotFolder, file));
                    }
                    else {
                        const pin = yield fs_extra_1.readJSON(pinFile);
                        if (!pin || pin.timestamp !== timestamp) {
                            logol_1.info('Remove unused snapshot', snapshotFolder, file);
                            yield fs_extra_1.remove(path_1.join(snapshotFolder, file));
                        }
                    }
                }
            }
        }
    });
}
function crawl(crawlTarget, consumeTimeout = test_crawler_core_1.CONSUME_TIMEOUT, push) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepareFolders();
        yield beforeAll(crawlTarget);
        yield queueConsumer_1.setConsumerMaxCount(crawlTarget);
        crawlTarget && startCrawler_1.startCrawler(crawlTarget);
        resultConsumer_1.initConsumeResults(consumeTimeout, push);
        queueConsumer_1.initConsumeQueues(consumeTimeout, crawlTarget);
    });
}
exports.crawl = crawl;
//# sourceMappingURL=index.js.map