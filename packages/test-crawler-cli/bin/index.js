#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lockfile_1 = require("lockfile");
const logol_1 = require("logol");
const path_1 = require("path");
const test_crawler_lib_1 = require("test-crawler-lib");
const configs = require("test-crawler-lib/lib/config");
const crawl_1 = require("./crawl");
const lockFile = path_1.join(__dirname, '../../test-crawler.lock');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const [, , presetFile] = process.argv;
        if (presetFile) {
            const crawlerProvider = new test_crawler_lib_1.CrawlerProvider();
            const crawlerInput = yield crawlerProvider.startCrawlerWithPresetFile(presetFile);
            logol_1.info('Start with preset', JSON.stringify(crawlerInput, null, 4));
        }
        logol_1.info('Config', JSON.stringify(configs, null, 4));
        crawl_1.crawl();
    });
}
if (!lockfile_1.checkSync(lockFile)) {
    lockfile_1.lockSync(lockFile);
    start();
}
else {
    logol_1.info('Test-crawler already running', lockFile);
}
//# sourceMappingURL=index.js.map