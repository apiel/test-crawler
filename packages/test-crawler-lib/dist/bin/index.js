#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lockfile_1 = require("lockfile");
const npmlog_1 = require("npmlog");
const crawl_1 = require("./crawl");
const path_1 = require("path");
const lockFile = path_1.join(__dirname, '../../test-crawler.lock');
if (!lockfile_1.checkSync(lockFile)) {
    lockfile_1.lockSync(lockFile);
    crawl_1.crawl();
}
else {
    npmlog_1.info('Test-crawler already running', lockFile);
}
//# sourceMappingURL=index.js.map