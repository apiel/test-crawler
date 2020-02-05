"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
var CrawlerProvider_1 = require("./CrawlerProvider");
exports.CrawlerProvider = CrawlerProvider_1.CrawlerProvider;
exports.getConfig = () => config;
exports.CrawlerMethod = {
    URLs: 'urls',
    SPIDER_BOT: 'spiderbot',
};
