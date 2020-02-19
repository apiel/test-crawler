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
const config_1 = require("./config");
const utils_1 = require("./utils");
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
    applyChanges(changes) {
        const changesToApply = [];
        for (const { item } of changes) {
            if (item.type === typing_1.ChangeType.pin) {
                const { projectId, timestamp, id } = item.props;
                const srcBase = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, id);
                const dstBase = this.join(projectId, config_1.PIN_FOLDER, id);
                changesToApply.push({
                    type: 'copyToPins',
                    props: { srcBase, dstBase },
                });
            }
            else if (item.type === typing_1.ChangeType.setZoneStatus) {
                const { projectId, timestamp, id, index, status } = item.props;
                const jsonFile = this.join(projectId, config_1.CRAWL_FOLDER, timestamp, `${id}.json`);
                const pinJsonFile = this.join(projectId, config_1.PIN_FOLDER, `${id}.json`);
                changesToApply.push({
                    type: 'setZoneStatus',
                    props: { jsonFile, pinJsonFile, index, status },
                });
            }
        }
        return this.storage.applyChanges(changesToApply);
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
