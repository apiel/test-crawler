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
const path_1 = require("path");
const md5 = require("md5");
const pixdiff_zone_1 = require("pixdiff-zone");
const config_1 = require("./config");
const utils_1 = require("./utils");
const CrawlerProviderStorage_1 = require("./CrawlerProviderStorage");
class CrawlerProvider extends CrawlerProviderStorage_1.CrawlerProviderStorage {
    constructor(storageType, ctx) {
        super(storageType, ctx);
        this.ctx = ctx;
    }
    repos() {
        return this.storage.repos();
    }
    repo() {
        return this.storage.getRepo();
    }
    info() {
        return this.storage.info();
    }
    loadProject(projectId) {
        return this.storage.readJSON(this.join(projectId, `project.json`));
    }
    loadProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield this.storage.readdir(config_1.PROJECT_FOLDER);
            return Promise.all(projects.map(projectId => this.loadProject(projectId)));
        });
    }
    saveProject(crawlerInput, name, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectId) {
                projectId = md5(name);
            }
            const project = { id: projectId, name, crawlerInput };
            yield this.storage.saveJSON(this.join(projectId, 'project.json'), project);
            return project;
        });
    }
    getCrawler(projectId, timestamp) {
        const path = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
        return this.storage.readJSON(path);
    }
    getAllCrawlers(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.join(projectId, config_1.CRAWL_FOLDER);
            const folders = yield this.storage.readdir(path);
            const crawlers = yield Promise.all(folders.map(timestamp => this.getCrawler(projectId, timestamp)));
            return crawlers;
        });
    }
    copyToPins(projectId, timestamp, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const crawlerFolder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const crawlerFolderPath = utils_1.getFilePath(id, crawlerFolder);
            const data = yield this.storage.readJSON(crawlerFolderPath('json'));
            if ((_a = data) === null || _a === void 0 ? void 0 : _a.png) {
                data.png.diff = {
                    pixelDiffRatio: 0,
                    zones: [],
                };
                if (data.png.diff.pixelDiffRatio > 0) {
                    yield this.storage.saveJSON(crawlerFolderPath('json'), data);
                }
            }
            const pinFolderPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
            yield this.storage.saveJSON(pinFolderPath('json'), data);
            yield this.storage.copy(crawlerFolderPath('html'), pinFolderPath('html'));
            yield this.storage.copy(crawlerFolderPath('png'), pinFolderPath('png'));
            return data;
        });
    }
    removeFromPins(projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinFolderPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
            yield this.storage.remove(pinFolderPath('png'));
            yield this.storage.remove(pinFolderPath('html'));
            yield this.storage.remove(pinFolderPath('json'));
            return this.getPins(projectId);
        });
    }
    image(projectId, folder, id) {
        const target = folder === 'base'
            ? this.join(projectId, config_1.PIN_FOLDER)
            : this.join(projectId, config_1.CRAWL_FOLDER, folder);
        return this.storage.blob(utils_1.getFilePath(id, target)('png'));
    }
    saveCode(projectId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source } = code, codeInfo = __rest(code, ["source"]);
            const list = yield this.getCodeList(projectId);
            list[code.id] = codeInfo;
            yield this.storage.saveJSON(this.join(projectId, config_1.CODE_FOLDER, `list.json`), Object.assign({}, list));
            yield this.storage.saveFile(this.join(projectId, config_1.CODE_FOLDER, `${code.id}.js`), source);
        });
    }
    loadCode(projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.getCodeList(projectId);
            const codeInfo = list[id];
            const sourcePath = this.join(projectId, config_1.CODE_FOLDER, `${id}.js`);
            if (codeInfo) {
                const buffer = yield this.storage.read(sourcePath);
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
            const listPath = this.join(projectId, config_1.CODE_FOLDER, `list.json`);
            const list = yield this.storage.readJSON(listPath);
            return list || {};
        });
    }
    getPins(projectId) {
        return this.getPinsInFolder(this.join(projectId, config_1.PIN_FOLDER));
    }
    getPin(projectId, id) {
        return this.getPageInFolder(this.join(projectId, config_1.PIN_FOLDER), id);
    }
    getPages(projectId, timestamp) {
        return this.getPinsInFolder(this.join(projectId, config_1.CRAWL_FOLDER, timestamp));
    }
    getPageInFolder(folder, id) {
        return this.storage.readJSON(utils_1.getFilePath(id, folder)('json'));
    }
    getPinsInFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.storage.readdir(folder);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json' && file !== '_.json')
                .map(file => this.storage.readJSON(path_1.join(folder, file))));
        });
    }
    setCrawlerStatus(projectId, timestamp, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
            const crawler = yield this.storage.readJSON(file);
            crawler.status = status;
            yield this.storage.saveJSON(file, crawler);
            return crawler;
        });
    }
    setZoneStatus(projectId, timestamp, id, index, status) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const data = yield this.storage.readJSON(filePath('json'));
            if (status === 'pin') {
                const pinPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
                const pin = yield this.storage.readJSON(pinPath('json'));
                if (((_c = (_b = (_a = pin) === null || _a === void 0 ? void 0 : _a.png) === null || _b === void 0 ? void 0 : _b.diff) === null || _c === void 0 ? void 0 : _c.zones) && ((_f = (_e = (_d = data) === null || _d === void 0 ? void 0 : _d.png) === null || _e === void 0 ? void 0 : _e.diff) === null || _f === void 0 ? void 0 : _f.zones)) {
                    pin.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                    const zones = pin.png.diff.zones.map(item => item.zone);
                    zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                    const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                    pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
                }
                yield this.storage.saveJSON(pinPath('json'), pin);
            }
            if ((_j = (_h = (_g = data) === null || _g === void 0 ? void 0 : _g.png) === null || _h === void 0 ? void 0 : _h.diff) === null || _j === void 0 ? void 0 : _j.zones) {
                data.png.diff.zones[index].status = status;
            }
            yield this.storage.saveJSON(filePath('json'), data);
            return data;
        });
    }
    setZonesStatus(projectId, timestamp, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const page = yield this.storage.readJSON(filePath('json'));
            let newPage;
            for (let index = 0; index < page.png.diff.zones.length; index++) {
                newPage = yield this.setZoneStatus(projectId, timestamp, id, index, status);
            }
            return newPage;
        });
    }
    startCrawler(projectId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pagesFolder = Math.floor(Date.now() / 1000).toString();
            const crawlTarget = { projectId, pagesFolder };
            const redirect = yield this.storage.crawl(crawlTarget, 30, (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.push);
            return {
                timestamp: pagesFolder,
                redirect,
            };
        });
    }
    join(projectId, ...path) {
        return path_1.join(config_1.PROJECT_FOLDER, projectId, ...path);
    }
}
exports.CrawlerProvider = CrawlerProvider;
