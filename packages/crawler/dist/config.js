"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.BASE_URL = 'http://localhost:3005/';
exports.PAGES_FOLDER = path_1.join(__dirname, '../pages');
exports.CRAWL_FOLDER = path_1.join(exports.PAGES_FOLDER, 'crawl');
exports.BASE_FOLDER = path_1.join(exports.PAGES_FOLDER, 'base');
exports.MAX_HISTORY = 4;
exports.TIMEOUT = 10000;
exports.CONSUMER_COUNT = 5;
exports.USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
//# sourceMappingURL=config.js.map