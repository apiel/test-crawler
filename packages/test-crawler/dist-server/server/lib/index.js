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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const rimraf = require("rimraf");
const md5 = require("md5");
const axios_1 = require("axios");
const pixdiff_zone_1 = require("pixdiff-zone");
const config_1 = require("./config");
const utils_1 = require("./utils");
const config = require("./config");
const crawl_1 = require("./crawl");
exports.getConfig = () => config;
exports.CrawlerMethod = {
    URLs: 'urls',
    SPIDER_BOT: 'spiderbot',
};
class CrawlerProvider {
    copyFile(filePath, basePath, extension) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = filePath(extension);
            if (yield fs_extra_1.pathExists(file)) {
                yield fs_extra_1.copy(file, basePath(extension), { overwrite: true });
            }
        });
    }
    getSettings() {
        return {
            dir: __dirname,
        };
    }
    setZoneStatus(timestamp, id, index, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const data = yield fs_extra_1.readJson(filePath('json'));
            if (status === 'pin') {
                const basePath = utils_1.getFilePath(id, config_1.BASE_FOLDER);
                const base = yield fs_extra_1.readJson(basePath('json'));
                base.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                const zones = base.png.diff.zones.map(item => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                base.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
                yield fs_extra_1.outputJSON(basePath('json'), base, { spaces: 4 });
            }
            data.png.diff.zones[index].status = status;
            yield fs_extra_1.outputJSON(filePath('json'), data, { spaces: 4 });
            return data;
        });
    }
    setZonesStatus(timestamp, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const page = yield fs_extra_1.readJson(filePath('json'));
            let newPage;
            for (let index = 0; index < page.png.diff.zones.length; index++) {
                newPage = yield this.setZoneStatus(timestamp, id, index, status);
            }
            return newPage;
        });
    }
    copyToBase(timestamp, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.mkdirp(config_1.BASE_FOLDER);
            const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const basePath = utils_1.getFilePath(id, config_1.BASE_FOLDER);
            const data = yield fs_extra_1.readJson(filePath('json'));
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            yield fs_extra_1.outputJSON(filePath('json'), data, { spaces: 4 });
            yield this.copyFile(filePath, basePath, 'png');
            yield this.copyFile(filePath, basePath, 'html');
            yield this.copyFile(filePath, basePath, 'json');
            return data;
        });
    }
    image(folder, id) {
        const target = folder === 'base' ? config_1.BASE_FOLDER : path_1.join(config_1.CRAWL_FOLDER, folder);
        const filePath = utils_1.getFilePath(id, target);
        return fs_extra_1.readFile(filePath('png'));
    }
    saveCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source } = code, codeInfo = __rest(code, ["source"]);
            const list = yield this.getCodeList();
            list[code.id] = codeInfo;
            fs_extra_1.outputJSON(path_1.join(config_1.CODE_FOLDER, `list.json`), Object.assign({}, list), { spaces: 4 });
            fs_extra_1.outputFile(path_1.join(config_1.CODE_FOLDER, `${code.id}.js`), source);
        });
    }
    loadCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.getCodeList();
            const codeInfo = list[id];
            const sourcePath = path_1.join(config_1.CODE_FOLDER, `${id}.js`);
            if (!codeInfo || !(yield fs_extra_1.pathExists(sourcePath))) {
                return {
                    id,
                    name: '',
                    pattern: '',
                    source: '',
                };
            }
            const source = (yield fs_extra_1.readFile(sourcePath)).toString();
            return Object.assign(Object.assign({}, codeInfo), { source });
        });
    }
    getCodeList() {
        return __awaiter(this, void 0, void 0, function* () {
            return utils_1.getCodeList();
        });
    }
    getBasePages() {
        return this.getPagesInFolder(config_1.BASE_FOLDER);
    }
    getBasePage(id) {
        return this.getPageInFolder(config_1.BASE_FOLDER, id);
    }
    getPages(timestamp) {
        const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
        return this.getPagesInFolder(folder);
    }
    getPageInFolder(folder, id) {
        const filePath = utils_1.getFilePath(id, folder);
        return fs_extra_1.readJSON(filePath('json'));
    }
    getPagesInFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.mkdirp(folder);
            const files = yield fs_extra_1.readdir(folder);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json' && file !== '_.json')
                .map(file => fs_extra_1.readJSON(path_1.join(folder, file))));
        });
    }
    setCrawlerStatus(timestamp, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = path_1.join(config_1.CRAWL_FOLDER, timestamp, '_.json');
            const crawler = yield fs_extra_1.readJson(file);
            crawler.status = status;
            yield fs_extra_1.outputJSON(file, crawler, { spaces: 4 });
            return crawler;
        });
    }
    getCrawler(timestamp) {
        return fs_extra_1.readJSON(path_1.join(config_1.CRAWL_FOLDER, timestamp, '_.json'));
    }
    getAllCrawlers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.mkdirp(config_1.CRAWL_FOLDER);
            const folders = yield fs_extra_1.readdir(config_1.CRAWL_FOLDER);
            const crawlers = yield Promise.all(folders.map(folder => fs_extra_1.readJSON(path_1.join(config_1.CRAWL_FOLDER, folder, '_.json'))));
            return crawlers;
        });
    }
    loadProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.mkdirp(config_1.PROJECT_FOLDER);
            const files = yield fs_extra_1.readdir(config_1.PROJECT_FOLDER);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json')
                .map(file => fs_extra_1.readJSON(path_1.join(config_1.PROJECT_FOLDER, file))));
        });
    }
    loadProject(id) {
        return fs_extra_1.readJSON(path_1.join(config_1.PROJECT_FOLDER, `${id}.json`));
    }
    saveProject(crawlerInput, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = md5(name);
            const file = path_1.join(config_1.PROJECT_FOLDER, `${id}.json`);
            yield fs_extra_1.outputJSON(file, { id, name, crawlerInput }, { spaces: 4 });
            return id;
        });
    }
    startCrawlerFromProject(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { crawlerInput } = yield fs_extra_1.readJSON(file);
            yield this.startCrawler(crawlerInput, false);
            return crawlerInput;
        });
    }
    startCrawler(crawlerInput, runProcess = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cleanHistory();
            const timestamp = Math.floor(Date.now() / 1000);
            const id = md5(`${timestamp}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);
            const crawler = Object.assign(Object.assign({}, crawlerInput), { timestamp,
                id, diffZoneCount: 0, errorCount: 0, status: 'review', inQueue: 1, urlsCount: 0, startAt: Date.now(), lastUpdate: Date.now() });
            const distFolder = path_1.join(config_1.CRAWL_FOLDER, (timestamp).toString());
            yield fs_extra_1.outputJSON(path_1.join(distFolder, '_.json'), crawler, { spaces: 4 });
            if (crawlerInput.method === exports.CrawlerMethod.URLs) {
                yield this.startUrlsCrawling(crawlerInput, distFolder);
            }
            else {
                yield this.startSpiderBotCrawling(crawlerInput, distFolder);
            }
            if (runProcess) {
                crawl_1.crawl(timestamp.toString());
            }
            return {
                crawler,
                config: { MAX_HISTORY: config_1.MAX_HISTORY },
            };
        });
    }
    startUrlsCrawling(crawlerInput, distFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(crawlerInput.url);
            const urls = data.split(`\n`).filter((url) => url.trim());
            yield Promise.all(urls.map((url) => utils_1.addToQueue(url, crawlerInput.viewport, distFolder)));
        });
    }
    startSpiderBotCrawling({ url, viewport, limit }, distFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedToqueue = yield utils_1.addToQueue(url, viewport, distFolder, limit);
            if (!addedToqueue) {
                throw (new Error('Something went wrong while adding job to queue'));
            }
        });
    }
    cleanHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield utils_1.getFolders();
            const cleanUp = folders.slice(0, -(config_1.MAX_HISTORY - 1));
            cleanUp.forEach((folder) => {
                rimraf.sync(path_1.join(config_1.CRAWL_FOLDER, folder));
            });
        });
    }
}
exports.CrawlerProvider = CrawlerProvider;
