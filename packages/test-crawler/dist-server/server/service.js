"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const crawlerProvider = new lib_1.CrawlerProvider();
function getSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        return crawlerProvider.getSettings();
    });
}
exports.getSettings = getSettings;
function loadProject(storageType, projectId) {
    return crawlerProvider.loadProject(storageType, projectId);
}
exports.loadProject = loadProject;
function loadProjects(storageType) {
    return crawlerProvider.loadProjects(storageType);
}
exports.loadProjects = loadProjects;
function saveProject(storageType, crawlerInput, name, projectId) {
    return crawlerProvider.saveProject(storageType, crawlerInput, name, projectId);
}
exports.saveProject = saveProject;
function getCrawler(storageType, projectId, timestamp) {
    return crawlerProvider.getCrawler(storageType, projectId, timestamp);
}
exports.getCrawler = getCrawler;
function getCrawlers(storageType, projectId) {
    return crawlerProvider.getAllCrawlers(storageType, projectId);
}
exports.getCrawlers = getCrawlers;
function getPages(storageType, projectId, timestamp) {
    return crawlerProvider.getPages(storageType, projectId, timestamp);
}
exports.getPages = getPages;
function getPins(storageType, projectId) {
    return crawlerProvider.getPins(storageType, projectId);
}
exports.getPins = getPins;
function getPin(storageType, projectId, id) {
    return crawlerProvider.getPin(storageType, projectId, id);
}
exports.getPin = getPin;
function setCode(storageType, projectId, code) {
    return crawlerProvider.saveCode(storageType, projectId, code);
}
exports.setCode = setCode;
function getCode(storageType, projectId, id) {
    return crawlerProvider.loadCode(storageType, projectId, id);
}
exports.getCode = getCode;
function getCodes(storageType, projectId) {
    return crawlerProvider.getCodeList(storageType, projectId);
}
exports.getCodes = getCodes;
function getThumbnail(storageType, projectId, folder, id, width = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield crawlerProvider.image(storageType, projectId, folder, id);
        if (!image) {
            throw new Error('Cannot load image.');
        }
        return `data:image/png;base64, ${(image).toString('base64')}`;
    });
}
exports.getThumbnail = getThumbnail;
function removePin(storageType, projectId, id) {
    return crawlerProvider.removeFromPins(storageType, projectId, id);
}
exports.removePin = removePin;
function pin(storageType, projectId, timestamp, id) {
    return crawlerProvider.copyToPins(storageType, projectId, timestamp, id);
}
exports.pin = pin;
function setZoneStatus(storageType, projectId, timestamp, id, index, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZoneStatus(storageType, projectId, timestamp, id, index, status);
        return getPages(storageType, projectId, timestamp);
    });
}
exports.setZoneStatus = setZoneStatus;
function setZonesStatus(storageType, projectId, timestamp, id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZonesStatus(storageType, projectId, timestamp, id, status);
        return getPages(storageType, projectId, timestamp);
    });
}
exports.setZonesStatus = setZonesStatus;
function setStatus(storageType, projectId, timestamp, status) {
    return crawlerProvider.setCrawlerStatus(storageType, projectId, timestamp, status);
}
exports.setStatus = setStatus;
function startCrawler(storageType, projectId) {
    const { push } = this;
    return crawlerProvider.startCrawler(storageType, projectId, push);
}
exports.startCrawler = startCrawler;
function startCrawlers() {
    const { push } = this;
    return crawlerProvider.startCrawlers(push);
}
exports.startCrawlers = startCrawlers;
