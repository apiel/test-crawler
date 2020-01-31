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
function getCrawlers(projectId) {
    return crawlerProvider.getAllCrawlers(projectId);
}
exports.getCrawlers = getCrawlers;
function loadProject(projectId) {
    return crawlerProvider.loadProject(projectId);
}
exports.loadProject = loadProject;
function loadProjects() {
    return crawlerProvider.loadProjects();
}
exports.loadProjects = loadProjects;
function saveProject(crawlerInput, name, projectId) {
    return crawlerProvider.saveProject(crawlerInput, name, projectId);
}
exports.saveProject = saveProject;
function getCrawler(projectId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        return crawlerProvider.getCrawler(projectId, timestamp);
    });
}
exports.getCrawler = getCrawler;
function getPages(projectId, timestamp) {
    return crawlerProvider.getPages(projectId, timestamp);
}
exports.getPages = getPages;
function getPins(projectId) {
    return crawlerProvider.getBasePages(projectId);
}
exports.getPins = getPins;
function getPin(projectId, id) {
    return crawlerProvider.getBasePage(projectId, id);
}
exports.getPin = getPin;
function setCode(projectId, code) {
    return crawlerProvider.saveCode(projectId, code);
}
exports.setCode = setCode;
function getCode(projectId, id) {
    return crawlerProvider.loadCode(projectId, id);
}
exports.getCode = getCode;
function getCodes(projectId) {
    return crawlerProvider.getCodeList(projectId);
}
exports.getCodes = getCodes;
function getThumbnail(projectId, folder, id, width = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield crawlerProvider.image(projectId, folder, id);
        return `data:image/png;base64, ${(image).toString('base64')}`;
    });
}
exports.getThumbnail = getThumbnail;
function pin(projectId, timestamp, id) {
    return crawlerProvider.copyToBase(projectId, timestamp, id);
}
exports.pin = pin;
function setZoneStatus(projectId, timestamp, id, index, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZoneStatus(projectId, timestamp, id, index, status);
        return getPages(projectId, timestamp);
    });
}
exports.setZoneStatus = setZoneStatus;
function setZonesStatus(projectId, timestamp, id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield crawlerProvider.setZonesStatus(projectId, timestamp, id, status);
        return getPages(projectId, timestamp);
    });
}
exports.setZonesStatus = setZonesStatus;
function setStatus(projectId, timestamp, status) {
    return crawlerProvider.setCrawlerStatus(projectId, timestamp, status);
}
exports.setStatus = setStatus;
function startCrawlerFromProject(projectId) {
    return crawlerProvider.startCrawlerFromProject(projectId);
}
exports.startCrawlerFromProject = startCrawlerFromProject;
function startCrawlers() {
    return crawlerProvider.startCrawlers();
}
exports.startCrawlers = startCrawlers;
