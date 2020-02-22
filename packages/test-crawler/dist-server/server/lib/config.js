"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const test_crawler_core_1 = require("test-crawler-core");
exports.config = getConfig();
function getConfig() {
    const configFile = path_1.join(test_crawler_core_1.ROOT_FOLDER, 'test-crawler.config.js');
    let config;
    try {
        config = require(configFile);
    }
    catch (e) {
        config = {};
    }
    return Object.assign({ remote: {} }, config);
}
