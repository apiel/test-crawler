"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_crawler_lib_1 = require("test-crawler-lib");
const sharp = require("sharp");
const crawlerProvider = new test_crawler_lib_1.CrawlerProvider();
function getCrawlers() {
    return crawlerProvider.getAllCrawlers();
}
exports.getCrawlers = getCrawlers;
function startCrawler(crawlerInput) {
    return this.crawlerProvider.startCrawler(crawlerInput);
}
exports.startCrawler = startCrawler;
function getCrawler(timestamp) {
    return this.crawlerProvider.getCrawler(timestamp);
}
exports.getCrawler = getCrawler;
function getPages(timestamp) {
    return this.crawlerProvider.getPages(timestamp);
}
exports.getPages = getPages;
function getPins() {
    return this.crawlerProvider.getBasePages();
}
exports.getPins = getPins;
function thumbnail(folder, id, width = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield this.crawlerProvider.image(folder, id);
        return sharp(image).resize(width).toBuffer();
    });
}
exports.thumbnail = thumbnail;
function pin(timestamp, id) {
    return this.crawlerProvider.copyToBase(timestamp, id);
}
exports.pin = pin;
function setZoneStatus(timestamp, id, index, status) {
    return this.crawlerProvider.setZoneStatus(timestamp, id, index, status);
}
exports.setZoneStatus = setZoneStatus;
function setStatus(timestamp, status) {
    return this.crawlerProvider.setCrawlerStatus(timestamp, status);
}
exports.setStatus = setStatus;
