#!/usr/bin/env node
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
const lockfile_1 = require("lockfile");
const logol_1 = require("logol");
const path_1 = require("path");
const lib_1 = require("../dist-server/server/lib");
const crawl_1 = require("../dist-server/server/lib/crawl");
const configs = require("../dist-server/server/lib/config");
const storage_typing_1 = require("../dist-server/server/storage.typing");
const lockFile = path_1.join(__dirname, '../../test-crawler.lock');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Test-crawler');
        logol_1.info('Config', configs);
        const [, , option, value] = process.argv;
        if (option && value) {
            if (option === '--project') {
                logol_1.info('Start project', value);
                const crawlerProvider = new lib_1.CrawlerProvider();
                const result = yield crawlerProvider.startCrawler(storage_typing_1.StorageType.Local, value);
                logol_1.info('timestamp', result);
                return;
            }
        }
        crawl_1.crawl(undefined, 30);
    });
}
if (!lockfile_1.checkSync(lockFile)) {
    lockfile_1.lockSync(lockFile);
    start();
}
else {
    logol_1.info('Test-crawler already running', lockFile);
}
//# sourceMappingURL=cli.js.map