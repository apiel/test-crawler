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
    return crawlerProvider.startCrawler(crawlerInput);
}
exports.startCrawler = startCrawler;
function getCrawler(timestamp) {
    return crawlerProvider.getCrawler(timestamp);
}
exports.getCrawler = getCrawler;
function getPages(timestamp) {
    return crawlerProvider.getPages(timestamp);
}
exports.getPages = getPages;
function getPins() {
    return crawlerProvider.getBasePages();
}
exports.getPins = getPins;
function getPin(id) {
    return crawlerProvider.getBasePage(id);
}
exports.getPin = getPin;
function setPinCode(id, code) {
    return crawlerProvider.saveBasePageCode(id, code);
}
exports.setPinCode = setPinCode;
function getPinCode(id) {
    return crawlerProvider.loadBasePageCode(id);
}
exports.getPinCode = getPinCode;
function getThumbnail(folder, id, width = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield crawlerProvider.image(folder, id);
        return `data:image/png;base64, `
            + (yield sharp(image).resize(width).toBuffer()).toString('base64');
    });
}
exports.getThumbnail = getThumbnail;
function pin(timestamp, id) {
    return crawlerProvider.copyToBase(timestamp, id);
}
exports.pin = pin;
function setZoneStatus(timestamp, id, index, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZoneStatus(timestamp, id, index, status);
        return getPages(timestamp);
    });
}
exports.setZoneStatus = setZoneStatus;
function setZonesStatus(timestamp, id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZonesStatus(timestamp, id, status);
        return getPages(timestamp);
    });
}
exports.setZonesStatus = setZonesStatus;
function setStatus(timestamp, status) {
    return crawlerProvider.setCrawlerStatus(timestamp, status);
}
exports.setStatus = setStatus;
