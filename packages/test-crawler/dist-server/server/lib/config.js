"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.PAGES_FOLDER = process.env.PAGES_FOLDER || path_1.join(__dirname, '../../../pages');
exports.CRAWL_FOLDER = path_1.join(exports.PAGES_FOLDER, 'crawl');
exports.PROJECT_FOLDER = path_1.join(exports.PAGES_FOLDER, 'project');
exports.BASE_FOLDER = path_1.join(exports.PAGES_FOLDER, 'base');
exports.CODE_FOLDER = path_1.join(exports.PAGES_FOLDER, 'code');
exports.MAX_HISTORY = 10;
exports.TIMEOUT = 10000;
exports.CONSUMER_COUNT = 5;
exports.USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
exports.CONSUME_TIMEOUT = process.env.CONSUME_TIMEOUT ? parseInt(process.env.CONSUME_TIMEOUT, 10) : 0;
