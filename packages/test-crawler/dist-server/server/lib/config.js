"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.ROOT_FOLDER = process.env.ROOT_FOLDER || path_1.join(__dirname, '../../..');
exports.config = getConfig();
function getConfig() {
    const configFile = path_1.join(exports.ROOT_FOLDER, 'test-crawler.config.js');
    let config;
    try {
        config = require(configFile);
    }
    catch (e) {
        config = {};
    }
    return Object.assign({ remote: {} }, config);
}
