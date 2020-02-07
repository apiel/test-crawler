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
const md5 = require("md5");
const pixdiff_zone_1 = require("pixdiff-zone");
const config_1 = require("./config");
const utils_1 = require("./utils");
const crawl_1 = require("./crawl");
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
    copyToPins(projectId, timestamp, id, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlerFolder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const crawlerFolderPath = utils_1.getFilePath(id, crawlerFolder);
            const data = yield this.readJSON(projectId, crawlerFolderPath('json'), forceLocal);
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                yield this.saveJSON(projectId, crawlerFolderPath('json'), data, forceLocal);
            }
            const pinFolderPath = utils_1.getFilePath(id, config_1.PIN_FOLDER);
            yield this.saveJSON(projectId, pinFolderPath('json'), data, forceLocal);
            yield this.copy(projectId, crawlerFolderPath('html'), pinFolderPath('html'), forceLocal);
            yield this.copy(projectId, crawlerFolderPath('png'), pinFolderPath('png'), forceLocal);
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
    getCodeList(projectId, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const listPath = path_1.join(config_1.CODE_FOLDER, `list.json`);
            const list = yield this.readJSON(projectId, listPath, forceLocal);
            return list || {};
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
            const file = path_1.join(config_1.CRAWL_FOLDER, timestamp, '_.json');
            const crawler = yield this.readJSON(projectId, file);
            crawler.status = status;
            yield this.saveJSON(projectId, file, crawler);
            return crawler;
        });
    }
    setZoneStatus(projectId, timestamp, id, index, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const data = yield this.readJSON(projectId, filePath('json'));
            if (status === 'pin') {
                const pinPath = utils_1.getFilePath(id, config_1.PIN_FOLDER);
                const pin = yield fs_extra_1.readJson(pinPath('json'));
                pin.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                const zones = pin.png.diff.zones.map(item => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
                yield this.saveJSON(projectId, pinPath('json'), pin);
            }
            data.png.diff.zones[index].status = status;
            yield this.saveJSON(projectId, filePath('json'), data);
            return data;
        });
    }
    setZonesStatus(projectId, timestamp, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const page = yield this.readJSON(projectId, filePath('json'));
            let newPage;
            for (let index = 0; index < page.png.diff.zones.length; index++) {
                newPage = yield this.setZoneStatus(projectId, timestamp, id, index, status);
            }
            return newPage;
        });
    }
    startCrawler(projectId, push) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagesFolder = Math.floor(Date.now() / 1000).toString();
            this.crawl(projectId, pagesFolder, 30, push);
            return pagesFolder;
        });
    }
    startCrawlers(push) {
        return __awaiter(this, void 0, void 0, function* () {
            crawl_1.crawl(undefined, 30, push);
        });
    }
}
exports.CrawlerProvider = CrawlerProvider;
