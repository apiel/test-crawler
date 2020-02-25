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
const logol_1 = require("logol");
const test_crawler_core_1 = require("test-crawler-core");
const configs = require("test-crawler-core/lib/config");
const lib_1 = require("../lib");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Test-crawler');
        logol_1.info('Config', configs);
        const [, , option, value] = process.argv;
        if (option && value) {
            if (option === '--project') {
                const crawlTarget = {
                    projectId: value,
                    timestamp: test_crawler_core_1.generateTinestampFolder(),
                };
                logol_1.info('Start project', crawlTarget);
                const result = yield lib_1.crawl(crawlTarget);
                logol_1.info('result', result);
                return;
            }
        }
        lib_1.crawl(undefined);
    });
}
start();
//# sourceMappingURL=cli.js.map