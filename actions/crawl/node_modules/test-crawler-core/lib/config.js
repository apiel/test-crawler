"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.ROOT_FOLDER = process.env.ROOT_FOLDER
    ? path_1.resolve(process.env.ROOT_FOLDER)
    : process.cwd();
exports.PROJECT_FOLDER = process.env.PROJECT_FOLDER || 'test-crawler';
exports.CRAWL_FOLDER = 'crawl';
exports.PIN_FOLDER = 'pin';
exports.CODE_FOLDER = 'code';
exports.QUEUE_FOLDER = 'queue';
exports.SNAPSHOT_FOLDER = 'snapshot';
exports.MAX_HISTORY = 10;
exports.TIMEOUT = 10000;
exports.CONSUMER_COUNT = 5;
exports.USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
exports.CONSUME_TIMEOUT = process.env.CONSUME_TIMEOUT
    ? parseInt(process.env.CONSUME_TIMEOUT, 10)
    : 0;
//# sourceMappingURL=config.js.map