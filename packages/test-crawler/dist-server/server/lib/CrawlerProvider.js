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
const typing_1 = require("../typing");
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
    jobs(projectId) {
        return this.storage.jobs(projectId);
    }
    loadProject(projectId) {
        return this.storage.readJSON(this.join(projectId, `project.json`));
    }
    loadProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield this.storage.readdir(config_1.PROJECT_FOLDER);
            console.log('projects', { projects });
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
            const jsonFile = path_1.join(crawlerFolder, `${id}.json`);
            const htmlFile = path_1.join(crawlerFolder, `${id}.html`);
            const pngFile = path_1.join(crawlerFolder, `${id}.png`);
            const data = yield this.storage.readJSON(jsonFile);
            if ((_a = data) === null || _a === void 0 ? void 0 : _a.png) {
                data.png.diff = {
                    pixelDiffRatio: 0,
                    zones: [],
                };
                if (data.png.diff.pixelDiffRatio > 0) {
                    yield this.storage.saveJSON(jsonFile, data);
                }
            }
            const pinJsonFile = this.join(projectId, config_1.PIN_FOLDER, `${id}.json`);
            const pinHtmlFile = this.join(projectId, config_1.PIN_FOLDER, `${id}.html`);
            const pinPngFile = this.join(projectId, config_1.PIN_FOLDER, `${id}.png`);
            yield this.storage.saveJSON(pinJsonFile, data);
            yield this.storage.copy(htmlFile, pinHtmlFile);
            this.storage.copyBlob(pngFile, pinPngFile);
            return data;
        });
    }
    removeFromPins(projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.remove(this.join(projectId, config_1.PIN_FOLDER, `${id}.png`));
            yield this.storage.remove(this.join(projectId, config_1.PIN_FOLDER, `${id}.html`));
            yield this.storage.remove(this.join(projectId, config_1.PIN_FOLDER, `${id}.json`));
            return this.getPins(projectId);
        });
    }
    image(projectId, folder, id) {
        const target = folder === 'base'
            ? this.join(projectId, config_1.PIN_FOLDER)
            : this.join(projectId, config_1.CRAWL_FOLDER, folder);
        return this.storage.blob(path_1.join(target, `${id}.png`));
    }
    saveBeforeAfterCode(projectId, type, code) {
        if (!Object.values(typing_1.BeforeAfterType).includes(type)) {
            throw new Error(`Unknown code type ${type}.`);
        }
        const file = this.join(projectId, `${type}.js`);
        if (!code.length) {
            return this.storage.remove(file);
        }
        return this.storage.saveFile(file, code);
    }
    getBeforeAfterCode(projectId, type) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(typing_1.BeforeAfterType).includes(type)) {
                throw new Error(`Unknown code type ${type}.`);
            }
            try {
                const buf = yield this.storage.read(this.join(projectId, `${type}`));
                return ((_a = buf) === null || _a === void 0 ? void 0 : _a.toString()) || '';
            }
            catch (err) { }
            return '';
        });
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
        return this.storage.readJSON(path_1.join(folder, `${id}.json`));
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
    setZoneStatus(projectId, timestamp, id, status, index) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const fileJson = path_1.join(folder, `${id}.json`);
            const data = yield this.storage.readJSON(fileJson);
            if (index && status === typing_1.ZoneStatus.zonePin) {
                const pinJsonFile = this.join(projectId, config_1.PIN_FOLDER, `${id}.json`);
                const pin = yield this.storage.readJSON(pinJsonFile);
                if (((_c = (_b = (_a = pin) === null || _a === void 0 ? void 0 : _a.png) === null || _b === void 0 ? void 0 : _b.diff) === null || _c === void 0 ? void 0 : _c.zones) && ((_f = (_e = (_d = data) === null || _d === void 0 ? void 0 : _d.png) === null || _e === void 0 ? void 0 : _e.diff) === null || _f === void 0 ? void 0 : _f.zones)) {
                    if (index) {
                        pin.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                    }
                    const zones = pin.png.diff.zones.map(item => item.zone);
                    zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                    const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                    pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
                }
                yield this.storage.saveJSON(pinJsonFile, pin);
            }
            if ((_j = (_h = (_g = data) === null || _g === void 0 ? void 0 : _g.png) === null || _h === void 0 ? void 0 : _h.diff) === null || _j === void 0 ? void 0 : _j.zones) {
                if (index) {
                    data.png.diff.zones[index].status = status;
                }
                else {
                    data.png.diff.zones.forEach(zone => zone.status = status);
                }
            }
            yield this.storage.saveJSON(fileJson, data);
            return this.getPages(projectId, timestamp);
        });
    }
    startCrawler(projectId, browser) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pagesFolder = Math.floor(Date.now() / 1000).toString();
            const crawlTarget = { projectId, pagesFolder };
            const redirect = yield this.storage.crawl(crawlTarget, 30, (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.push, browser);
            return {
                timestamp: pagesFolder,
                redirect,
            };
        });
    }
    get browsers() {
        return this.storage.browsers;
    }
    join(projectId, ...path) {
        return path_1.join(config_1.PROJECT_FOLDER, projectId, ...path);
    }
}
exports.CrawlerProvider = CrawlerProvider;
