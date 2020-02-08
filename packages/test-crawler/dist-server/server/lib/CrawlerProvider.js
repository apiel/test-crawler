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
const typing_1 = require("../typing");
const crawl_1 = require("./crawl");
const CrawlerProviderBase_1 = require("./CrawlerProviderBase");
class CrawlerProvider extends CrawlerProviderBase_1.CrawlerProviderBase {
    getSettings() {
        return {
            dir: __dirname,
        };
    }
    loadProject(remoteType, projectId) {
        return this.readJSON(remoteType, this.join(projectId, `project.json`));
    }
    loadProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            const localProjects = yield this.readdir(typing_1.RemoteType.Local, config_1.PROJECT_FOLDER);
            const githubProjects = yield this.readdir(typing_1.RemoteType.GitHub, config_1.PROJECT_FOLDER);
            return {
                [typing_1.RemoteType.Local]: yield Promise.all(localProjects.map(projectId => this.loadProject(typing_1.RemoteType.Local, projectId))),
                [typing_1.RemoteType.GitHub]: yield Promise.all(githubProjects.map(projectId => this.loadProject(typing_1.RemoteType.GitHub, projectId))),
            };
        });
    }
    saveProject(remoteType, crawlerInput, name, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectId) {
                projectId = md5(name);
            }
            const project = { id: projectId, name, crawlerInput };
            yield this.saveJSON(remoteType, 'project.json', project);
            return project;
        });
    }
    getCrawler(remoteType, projectId, timestamp) {
        const path = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
        return this.readJSON(remoteType, path);
    }
    getAllCrawlers(remoteType, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.join(projectId, config_1.CRAWL_FOLDER);
            const folders = yield this.readdir(remoteType, path);
            const crawlers = yield Promise.all(folders.map(timestamp => this.getCrawler(remoteType, projectId, timestamp)));
            return crawlers;
        });
    }
    copyToPins(remoteType, projectId, timestamp, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlerFolder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const crawlerFolderPath = utils_1.getFilePath(id, crawlerFolder);
            const data = yield this.readJSON(remoteType, crawlerFolderPath('json'));
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                yield this.saveJSON(remoteType, crawlerFolderPath('json'), data);
            }
            const pinFolderPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
            yield this.saveJSON(remoteType, pinFolderPath('json'), data);
            yield this.copy(remoteType, crawlerFolderPath('html'), pinFolderPath('html'));
            yield this.copy(remoteType, crawlerFolderPath('png'), pinFolderPath('png'));
            return data;
        });
    }
    removeFromPins(remoteType, projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinFolderPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
            yield this.remove(remoteType, pinFolderPath('png'));
            yield this.remove(remoteType, pinFolderPath('html'));
            yield this.remove(remoteType, pinFolderPath('json'));
            return this.getPins(remoteType, projectId);
        });
    }
    image(remoteType, projectId, folder, id) {
        const target = folder === 'base'
            ? this.join(projectId, config_1.PIN_FOLDER)
            : this.join(projectId, config_1.CRAWL_FOLDER, folder);
        return this.blob(remoteType, utils_1.getFilePath(id, target)('png'));
    }
    saveCode(remoteType, projectId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source } = code, codeInfo = __rest(code, ["source"]);
            const list = yield this.getCodeList(remoteType, projectId);
            list[code.id] = codeInfo;
            yield this.saveJSON(remoteType, this.join(projectId, config_1.CODE_FOLDER, `list.json`), Object.assign({}, list));
            yield this.saveFile(remoteType, this.join(projectId, config_1.CODE_FOLDER, `${code.id}.js`), source);
        });
    }
    loadCode(remoteType, projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.getCodeList(remoteType, projectId);
            const codeInfo = list[id];
            const sourcePath = this.join(projectId, config_1.CODE_FOLDER, `${id}.js`);
            if (codeInfo) {
                const buffer = yield this.read(remoteType, sourcePath);
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
    getCodeList(remoteType, projectId, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const listPath = this.join(projectId, config_1.CODE_FOLDER, `list.json`);
            const list = yield this.readJSON(remoteType, listPath);
            return list || {};
        });
    }
    getPins(remoteType, projectId) {
        return this.getPinsInFolder(remoteType, this.join(projectId, config_1.PIN_FOLDER));
    }
    getPin(remoteType, projectId, id) {
        return this.getPageInFolder(remoteType, this.join(projectId, config_1.PIN_FOLDER), id);
    }
    getPages(remoteType, projectId, timestamp) {
        return this.getPinsInFolder(remoteType, this.join(projectId, config_1.CRAWL_FOLDER, timestamp));
    }
    getPageInFolder(remoteType, folder, id) {
        return this.readJSON(remoteType, utils_1.getFilePath(id, folder)('json'));
    }
    getPinsInFolder(remoteType, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.readdir(remoteType, folder);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json' && file !== '_.json')
                .map(file => this.readJSON(remoteType, path_1.join(folder, file))));
        });
    }
    setCrawlerStatus(remoteType, projectId, timestamp, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, '_.json');
            const crawler = yield this.readJSON(remoteType, file);
            crawler.status = status;
            yield this.saveJSON(remoteType, file, crawler);
            return crawler;
        });
    }
    setZoneStatus(remoteType, projectId, timestamp, id, index, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const data = yield this.readJSON(remoteType, filePath('json'));
            if (status === 'pin') {
                const pinPath = utils_1.getFilePath(id, this.join(projectId, config_1.PIN_FOLDER));
                const pin = yield this.readJSON(remoteType, pinPath('json'));
                pin.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                const zones = pin.png.diff.zones.map(item => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
                yield this.saveJSON(remoteType, pinPath('json'), pin);
            }
            data.png.diff.zones[index].status = status;
            yield this.saveJSON(remoteType, filePath('json'), data);
            return data;
        });
    }
    setZonesStatus(remoteType, projectId, timestamp, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.join(projectId, config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const page = yield this.readJSON(remoteType, filePath('json'));
            let newPage;
            for (let index = 0; index < page.png.diff.zones.length; index++) {
                newPage = yield this.setZoneStatus(remoteType, projectId, timestamp, id, index, status);
            }
            return newPage;
        });
    }
    startCrawler(remoteType, projectId, push) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagesFolder = Math.floor(Date.now() / 1000).toString();
            this.crawl(remoteType, projectId, pagesFolder, 30, push);
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
