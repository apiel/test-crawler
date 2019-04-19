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
const npmlog_1 = require("npmlog");
const crawl_1 = require("./crawl");
const path_1 = require("path");
const lib_1 = require("../lib");
const lockFile = path_1.join(__dirname, '../../test-crawler.lock');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const [, , presetFile] = process.argv;
        if (presetFile) {
            const crawlerProvider = new lib_1.CrawlerProvider();
            const crawlerInput = yield crawlerProvider.startCrawlerWithPresetFile(presetFile);
            npmlog_1.info('Start with preset', JSON.stringify(crawlerInput));
        }
        crawl_1.crawl();
    });
}
if (!lockfile_1.checkSync(lockFile)) {
    lockfile_1.lockSync(lockFile);
    start();
}
else {
    npmlog_1.info('Test-crawler already running', lockFile);
}
//# sourceMappingURL=index.js.map