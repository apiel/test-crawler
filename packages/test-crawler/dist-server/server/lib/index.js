"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
var CrawlerProvider_1 = require("./CrawlerProvider");
exports.CrawlerProvider = CrawlerProvider_1.CrawlerProvider;
var CrawlerLocalProvider_1 = require("./CrawlerLocalProvider");
exports.CrawlerLocalProvider = CrawlerLocalProvider_1.CrawlerLocalProvider;
var CrawlerGitProvider_1 = require("./CrawlerGitProvider");
exports.CrawlerGitProvider = CrawlerGitProvider_1.CrawlerGitProvider;
exports.getConfig = () => config;
exports.CrawlerMethod = {
    URLs: 'urls',
    SPIDER_BOT: 'spiderbot',
};
