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
const crawl_1 = require("./crawl");
const _1 = require(".");
const CrawlerProviderBase_1 = require("./CrawlerProviderBase");
class CrawlerProvider extends CrawlerProviderBase_1.CrawlerProviderBase {
    getSettings() {
        return {
            dir: __dirname,
        };
    }
    loadProject(projectId) {
        return this.readJSON(projectId, `project.json`, CrawlerProviderBase_1.LOCAL);
    }
    loadProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield this.readdir('', '', CrawlerProviderBase_1.LOCAL);
            return Promise.all(projects.map(projectId => this.loadProject(projectId)));
        });
    }
    saveProject(crawlerInput, name, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectId) {
                projectId = md5(name);
            }
            const project = { id: projectId, name, crawlerInput };
            yield this.saveJSON(projectId, 'project.json', project, CrawlerProviderBase_1.LOCAL);
            return project;
        });
    }
    getCrawler(projectId, timestamp) {
        return this.readJSON(projectId, path_1.join(config_1.CRAWL_FOLDER, timestamp, '_.json'));
    }
    getAllCrawlers(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield this.readdir(projectId, config_1.CRAWL_FOLDER);
            const crawlers = yield Promise.all(folders.map(timestamp => this.getCrawler(projectId, timestamp)));
            return crawlers;
        });
    }
    copyToPins(projectId, timestamp, id, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlerFolder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const crawlerFolderPath = utils_1.getFilePath(id, crawlerFolder);
            const data = yield this.readJSON(projectId, crawlerFolderPath('json'), local);
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                yield this.saveJSON(projectId, crawlerFolderPath('json'), data, local);
            }
            const pinFolderPath = utils_1.getFilePath(id, config_1.PIN_FOLDER);
            yield this.saveJSON(projectId, pinFolderPath('json'), data, local);
            yield this.copy(projectId, crawlerFolderPath('html'), pinFolderPath('html'), local);
            yield this.copy(projectId, crawlerFolderPath('png'), pinFolderPath('png'), local);
            return data;
        });
    }
    removeFromPins(projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinFolderPath = utils_1.getFilePath(id, config_1.PIN_FOLDER);
            yield this.remove(projectId, pinFolderPath('png'));
            yield this.remove(projectId, pinFolderPath('html'));
            yield this.remove(projectId, pinFolderPath('json'));
            return this.getPins(projectId);
        });
    }
    image(projectId, folder, id) {
        const target = folder === 'base' ? config_1.PIN_FOLDER : path_1.join(config_1.CRAWL_FOLDER, folder);
        return this.read(projectId, utils_1.getFilePath(id, target)('png'));
    }
    saveCode(projectId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source } = code, codeInfo = __rest(code, ["source"]);
            const list = yield this.getCodeList(projectId);
            list[code.id] = codeInfo;
            yield this.saveJSON(projectId, path_1.join(config_1.CODE_FOLDER, `list.json`), Object.assign({}, list));
            yield this.saveFile(projectId, path_1.join(config_1.CODE_FOLDER, `${code.id}.js`), source);
        });
    }
    loadCode(projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.getCodeList(projectId);
            const codeInfo = list[id];
            const sourcePath = path_1.join(config_1.CODE_FOLDER, `${id}.js`);
            if (codeInfo) {
                const buffer = yield this.read(projectId, sourcePath);
                if (buffer) {
                    const source = buffer.toString();
                    return Object.assign(Object.assign({}, codeInfo), { source });
                }
            }
            return {
                id,
                name: '',
                pattern: '',
                source: '',
            };
        });
    }
    getCodeList(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listPath = path_1.join(config_1.CODE_FOLDER, `list.json`);
            return this.readJSON(projectId, listPath);
        });
    }
    getPins(projectId) {
        return this.getPinsInFolder(projectId, config_1.PIN_FOLDER);
    }
    getPin(projectId, id) {
        return this.getPageInFolder(projectId, config_1.PIN_FOLDER, id);
    }
    getPages(projectId, timestamp) {
        return this.getPinsInFolder(projectId, path_1.join(config_1.CRAWL_FOLDER, timestamp));
    }
    getPageInFolder(projectId, folder, id) {
        return this.readJSON(projectId, utils_1.getFilePath(id, folder)('json'));
    }
    getPinsInFolder(projectId, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.readdir(projectId, folder);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json' && file !== '_.json')
                .map(file => this.readJSON(projectId, path_1.join(folder, file))));
        });
    }
    setCrawlerStatus(projectId, timestamp, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
            const crawler = yield fs_extra_1.readJson(file);
            crawler.status = status;
            yield fs_extra_1.outputJSON(file, crawler, { spaces: 4 });
            return crawler;
        });
    }
    setZoneStatus(projectId, timestamp, id, index, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const data = yield fs_extra_1.readJson(filePath('json'));
            if (status === 'pin') {
                const basePath = utils_1.getFilePath(id, path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.PIN_FOLDER));
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
    setZonesStatus(projectId, timestamp, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const page = yield fs_extra_1.readJson(filePath('json'));
            let newPage;
            for (let index = 0; index < page.png.diff.zones.length; index++) {
                newPage = yield this.setZoneStatus(projectId, timestamp, id, index, status);
            }
            return newPage;
        });
    }
    startCrawlerFromProject(projectId, push) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.loadProject(projectId);
            return this.startCrawler(projectId, project.crawlerInput, push);
        });
    }
    startCrawler(projectId, crawlerInput, push, runProcess = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cleanHistory(projectId);
            const timestamp = Math.floor(Date.now() / 1000);
            const id = md5(`${timestamp}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);
            const crawler = Object.assign(Object.assign({}, crawlerInput), { timestamp,
                id, diffZoneCount: 0, errorCount: 0, status: 'review', inQueue: 1, urlsCount: 0, startAt: Date.now(), lastUpdate: Date.now() });
            const distFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, (timestamp).toString());
            yield fs_extra_1.outputJSON(path_1.join(distFolder, '_.json'), crawler, { spaces: 4 });
            if (crawlerInput.method === _1.CrawlerMethod.URLs) {
                yield this.startUrlsCrawling(crawlerInput, distFolder);
            }
            else {
                yield this.startSpiderBotCrawling(crawlerInput, distFolder);
            }
            if (runProcess) {
                crawl_1.crawl({ projectId, pagesFolder: timestamp.toString() }, 30, push);
            }
            return {
                crawler,
                config: { MAX_HISTORY: config_1.MAX_HISTORY },
            };
        });
    }
    startCrawlers(push) {
        return __awaiter(this, void 0, void 0, function* () {
            crawl_1.crawl(undefined, 30, push);
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
    cleanHistory(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield utils_1.getFolders(projectId);
            const cleanUp = folders.slice(0, -(config_1.MAX_HISTORY - 1));
            cleanUp.forEach((folder) => {
                rimraf.sync(path_1.join(config_1.CRAWL_FOLDER, folder));
            });
        });
    }
}
exports.CrawlerProvider = CrawlerProvider;
