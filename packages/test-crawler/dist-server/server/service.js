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
function getSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            dir: __dirname,
        };
    });
}
exports.getSettings = getSettings;
function getInfo(storageType) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.info();
}
exports.getInfo = getInfo;
function getJobs(storageType, projectId) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.jobs(projectId);
}
exports.getJobs = getJobs;
function getRepo(storageType) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.repo();
}
exports.getRepo = getRepo;
function loadRepos(storageType) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.repos();
}
exports.loadRepos = loadRepos;
function loadProject(storageType, projectId) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.loadProject(projectId);
}
exports.loadProject = loadProject;
function loadProjects(storageType) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.loadProjects();
}
exports.loadProjects = loadProjects;
function saveProject(storageType, crawlerInput, name, projectId) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.saveProject(crawlerInput, name, projectId);
}
exports.saveProject = saveProject;
function getCrawler(storageType, projectId, timestamp) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getCrawler(projectId, timestamp);
}
exports.getCrawler = getCrawler;
function getCrawlers(storageType, projectId) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getAllCrawlers(projectId);
}
exports.getCrawlers = getCrawlers;
function getPages(storageType, projectId, timestamp) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getPages(projectId, timestamp);
}
exports.getPages = getPages;
function getPins(storageType, projectId) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getPins(projectId);
}
exports.getPins = getPins;
function getPin(storageType, projectId, id) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getPin(projectId, id);
}
exports.getPin = getPin;
function saveBeforeAfterCode(storageType, projectId, type, code) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.saveBeforeAfterCode(projectId, type, code);
}
exports.saveBeforeAfterCode = saveBeforeAfterCode;
function getBeforeAfterCode(storageType, projectId, type) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getBeforeAfterCode(projectId, type);
}
exports.getBeforeAfterCode = getBeforeAfterCode;
function setCode(storageType, projectId, code) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.saveCode(projectId, code);
}
exports.setCode = setCode;
function getCode(storageType, projectId, id) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.loadCode(projectId, id);
}
exports.getCode = getCode;
function getCodes(storageType, projectId) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.getCodeList(projectId);
}
exports.getCodes = getCodes;
function getThumbnail(storageType, projectId, timestamp, id, width = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
        const image = yield crawlerProvider.image(projectId, timestamp, id);
        console.log('img', image);
        if (!image) {
            throw new Error('Cannot load image.');
        }
        return `data:image/png;base64, ${(image).toString('base64')}`;
    });
}
exports.getThumbnail = getThumbnail;
function removePin(storageType, projectId, id) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.removeFromPins(projectId, id);
}
exports.removePin = removePin;
function pin(storageType, projectId, timestamp, id) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.copyToPins(projectId, timestamp, id);
}
exports.pin = pin;
function setZoneStatus(storageType, projectId, timestamp, id, index, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
        return crawlerProvider.setZoneStatus(projectId, timestamp, id, status, index);
    });
}
exports.setZoneStatus = setZoneStatus;
function setZonesStatus(storageType, projectId, timestamp, id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
        return crawlerProvider.setZoneStatus(projectId, timestamp, id, status);
    });
}
exports.setZonesStatus = setZonesStatus;
function setStatus(storageType, projectId, timestamp, status) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.setCrawlerStatus(projectId, timestamp, status);
}
exports.setStatus = setStatus;
function getBrowsers(storageType) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
        return crawlerProvider.browsers;
    });
}
exports.getBrowsers = getBrowsers;
function startCrawler(storageType, projectId, browser) {
    const crawlerProvider = new lib_1.CrawlerProvider(storageType, this);
    return crawlerProvider.startCrawler(projectId, browser);
}
exports.startCrawler = startCrawler;
function startCrawlers() {
    const crawlerProvider = new lib_1.CrawlerProvider(undefined, this);
    return crawlerProvider.startCrawlers();
}
exports.startCrawlers = startCrawlers;
