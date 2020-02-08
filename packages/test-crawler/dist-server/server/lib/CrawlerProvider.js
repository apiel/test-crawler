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
const CrawlerProviderBase_1 = require("./CrawlerProviderBase");
class CrawlerProvider extends CrawlerProviderBase_1.CrawlerProviderBase {
    getSettings() {
        return {
            dir: __dirname,
        };
    }
    loadProject(storageType, projectId) {
        return this.readJSON(storageType, this.join(projectId, `project.json`));
    }
    loadProjects(storageType) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield this.readdir(storageType, config_1.PROJECT_FOLDER);
            return Promise.all(projects.map(projectId => this.loadProject(storageType, projectId)));
        });
    }
    saveProject(storageType, crawlerInput, name, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectId) {
                projectId = md5(name);
            }
            const project = { id: projectId, name, crawlerInput };
            yield this.saveJSON(storageType, 'project.json', project);
            return project;
        });
    }
    getCrawler(storageType, projectId, timestamp) {
        const path = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
        return this.readJSON(storageType, path);
    }
    getAllCrawlers(storageType, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.join(projectId, config_1.CRAWL_FOLDER);
            const folders = yield this.readdir(storageType, path);
            const crawlers = yield Promise.all(folders.map(timestamp => this.getCrawler(storageType, projectId, timestamp)));
            return crawlers;
        });
    }
    copyToPins(storageType, projectId, timestamp, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const crawlerFolder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const crawlerFolderPath = utils_1.getFilePath(id, crawlerFolder);
            const data = yield this.readJSON(storageType, crawlerFolderPath('json'));
            if ((_a = data) === null || _a === void 0 ? void 0 : _a.png) {
                data.png.diff = {
                    pixelDiffRatio: 0,
                    zones: [],
                };
                if (data.png.diff.pixelDiffRatio > 0) {
                    yield this.saveJSON(storageType, crawlerFolderPath('json'), data);
                }
            }
            const pinFolderPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
            yield this.saveJSON(storageType, pinFolderPath('json'), data);
            yield this.copy(storageType, crawlerFolderPath('html'), pinFolderPath('html'));
            yield this.copy(storageType, crawlerFolderPath('png'), pinFolderPath('png'));
            return data;
        });
    }
    removeFromPins(storageType, projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinFolderPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
            yield this.remove(storageType, pinFolderPath('png'));
            yield this.remove(storageType, pinFolderPath('html'));
            yield this.remove(storageType, pinFolderPath('json'));
            return this.getPins(storageType, projectId);
        });
    }
    image(storageType, projectId, folder, id) {
        const target = folder === 'base'
            ? this.join(projectId, config_1.PIN_FOLDER)
            : this.join(projectId, config_1.CRAWL_FOLDER, folder);
        return this.blob(storageType, utils_1.getFilePath(id, target)('png'));
    }
    saveCode(storageType, projectId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source } = code, codeInfo = __rest(code, ["source"]);
            const list = yield this.getCodeList(storageType, projectId);
            list[code.id] = codeInfo;
            yield this.saveJSON(storageType, this.join(projectId, config_1.CODE_FOLDER, `list.json`), Object.assign({}, list));
            yield this.saveFile(storageType, this.join(projectId, config_1.CODE_FOLDER, `${code.id}.js`), source);
        });
    }
    loadCode(storageType, projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.getCodeList(storageType, projectId);
            const codeInfo = list[id];
            const sourcePath = this.join(projectId, config_1.CODE_FOLDER, `${id}.js`);
            if (codeInfo) {
                const buffer = yield this.read(storageType, sourcePath);
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
    getCodeList(storageType, projectId, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const listPath = this.join(projectId, config_1.CODE_FOLDER, `list.json`);
            const list = yield this.readJSON(storageType, listPath);
            return list || {};
        });
    }
    getPins(storageType, projectId) {
        return this.getPinsInFolder(storageType, this.join(projectId, config_1.PIN_FOLDER));
    }
    getPin(storageType, projectId, id) {
        return this.getPageInFolder(storageType, this.join(projectId, config_1.PIN_FOLDER), id);
    }
    getPages(storageType, projectId, timestamp) {
        return this.getPinsInFolder(storageType, this.join(projectId, config_1.CRAWL_FOLDER, timestamp));
    }
    getPageInFolder(storageType, folder, id) {
        return this.readJSON(storageType, utils_1.getFilePath(id, folder)('json'));
    }
    getPinsInFolder(storageType, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.readdir(storageType, folder);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json' && file !== '_.json')
                .map(file => this.readJSON(storageType, path_1.join(folder, file))));
        });
    }
    setCrawlerStatus(storageType, projectId, timestamp, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
            const crawler = yield this.readJSON(storageType, file);
            crawler.status = status;
            yield this.saveJSON(storageType, file, crawler);
            return crawler;
        });
    }
    setZoneStatus(storageType, projectId, timestamp, id, index, status) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const data = yield this.readJSON(storageType, filePath('json'));
            if (status === 'pin') {
                const pinPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
                const pin = yield this.readJSON(storageType, pinPath('json'));
                if (((_c = (_b = (_a = pin) === null || _a === void 0 ? void 0 : _a.png) === null || _b === void 0 ? void 0 : _b.diff) === null || _c === void 0 ? void 0 : _c.zones) && ((_f = (_e = (_d = data) === null || _d === void 0 ? void 0 : _d.png) === null || _e === void 0 ? void 0 : _e.diff) === null || _f === void 0 ? void 0 : _f.zones)) {
                    pin.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                    const zones = pin.png.diff.zones.map(item => item.zone);
                    zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                    const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                    pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
                }
                yield this.saveJSON(storageType, pinPath('json'), pin);
            }
            if ((_j = (_h = (_g = data) === null || _g === void 0 ? void 0 : _g.png) === null || _h === void 0 ? void 0 : _h.diff) === null || _j === void 0 ? void 0 : _j.zones) {
                data.png.diff.zones[index].status = status;
            }
            yield this.saveJSON(storageType, filePath('json'), data);
            return data;
        });
    }
    setZonesStatus(storageType, projectId, timestamp, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const page = yield this.readJSON(storageType, filePath('json'));
            let newPage;
            for (let index = 0; index < page.png.diff.zones.length; index++) {
                newPage = yield this.setZoneStatus(storageType, projectId, timestamp, id, index, status);
            }
            return newPage;
        });
    }
    startCrawler(storageType, projectId, push) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagesFolder = Math.floor(Date.now() / 1000).toString();
            this.crawl(storageType, projectId, pagesFolder, 30, push);
            return pagesFolder;
        });
    }
}
exports.CrawlerProvider = CrawlerProvider;
