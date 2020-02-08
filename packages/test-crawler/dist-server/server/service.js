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
function loadProject(remoteType, projectId) {
    return crawlerProvider.loadProject(remoteType, projectId);
}
exports.loadProject = loadProject;
function loadProjects() {
    return crawlerProvider.loadProjects();
}
exports.loadProjects = loadProjects;
function saveProject(remoteType, crawlerInput, name, projectId) {
    return crawlerProvider.saveProject(remoteType, crawlerInput, name, projectId);
}
exports.saveProject = saveProject;
function getCrawler(remoteType, projectId, timestamp) {
    return crawlerProvider.getCrawler(remoteType, projectId, timestamp);
}
exports.getCrawler = getCrawler;
function getCrawlers(remoteType, projectId) {
    return crawlerProvider.getAllCrawlers(remoteType, projectId);
}
exports.getCrawlers = getCrawlers;
function getPages(remoteType, projectId, timestamp) {
    return crawlerProvider.getPages(remoteType, projectId, timestamp);
}
exports.getPages = getPages;
function getPins(remoteType, projectId) {
    return crawlerProvider.getPins(remoteType, projectId);
}
exports.getPins = getPins;
function getPin(remoteType, projectId, id) {
    return crawlerProvider.getPin(remoteType, projectId, id);
}
exports.getPin = getPin;
function setCode(remoteType, projectId, code) {
    return crawlerProvider.saveCode(remoteType, projectId, code);
}
exports.setCode = setCode;
function getCode(remoteType, projectId, id) {
    return crawlerProvider.loadCode(remoteType, projectId, id);
}
exports.getCode = getCode;
function getCodes(remoteType, projectId) {
    return crawlerProvider.getCodeList(remoteType, projectId);
}
exports.getCodes = getCodes;
function getThumbnail(remoteType, projectId, folder, id, width = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield crawlerProvider.image(remoteType, projectId, folder, id);
        return `data:image/png;base64, ${(image).toString('base64')}`;
    });
}
exports.getThumbnail = getThumbnail;
function removePin(remoteType, projectId, id) {
    return crawlerProvider.removeFromPins(remoteType, projectId, id);
}
exports.removePin = removePin;
function pin(remoteType, projectId, timestamp, id) {
    return crawlerProvider.copyToPins(remoteType, projectId, timestamp, id);
}
exports.pin = pin;
function setZoneStatus(remoteType, projectId, timestamp, id, index, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZoneStatus(remoteType, projectId, timestamp, id, index, status);
        return getPages(remoteType, projectId, timestamp);
    });
}
exports.setZoneStatus = setZoneStatus;
function setZonesStatus(remoteType, projectId, timestamp, id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZonesStatus(remoteType, projectId, timestamp, id, status);
        return getPages(remoteType, projectId, timestamp);
    });
}
exports.setZonesStatus = setZonesStatus;
function setStatus(remoteType, projectId, timestamp, status) {
    return crawlerProvider.setCrawlerStatus(remoteType, projectId, timestamp, status);
}
exports.setStatus = setStatus;
function startCrawler(remoteType, projectId) {
    const { push } = this;
    return crawlerProvider.startCrawler(remoteType, projectId, push);
}
exports.startCrawler = startCrawler;
function startCrawlers() {
    const { push } = this;
    return crawlerProvider.startCrawlers(push);
}
exports.startCrawlers = startCrawlers;
