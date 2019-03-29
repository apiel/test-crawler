"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const rimraf = require("rimraf");
const md5 = require("md5");
const config_1 = require("./config");
const utils_1 = require("./utils");
const config = require("./config");
exports.getConfig = () => config;
class CrawlerProvider {
    copyFile(filePath, basePath, extension) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = filePath(extension);
            if (yield fs_extra_1.pathExists(file)) {
                yield fs_extra_1.copy(file, basePath(extension), { overwrite: true });
            }
        });
    }
    copyToBase(timestamp, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
            const filePath = utils_1.getFilePath(id, folder);
            const basePath = utils_1.getFilePath(id, config_1.BASE_FOLDER);
            const data = yield fs_extra_1.readJson(filePath('json'));
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            yield fs_extra_1.writeJSON(filePath('json'), data);
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
    getBasePages() {
        return this.getPagesInFolder(config_1.BASE_FOLDER);
    }
    getPages(timestamp) {
        const folder = path_1.join(config_1.CRAWL_FOLDER, timestamp);
        return this.getPagesInFolder(folder);
    }
    getPagesInFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fs_extra_1.readdir(folder);
            return Promise.all(files.filter(file => path_1.extname(file) === '.json')
                .map(file => fs_extra_1.readJSON(path_1.join(folder, file))));
        });
    }
    getCrawler(timestamp) {
        return fs_extra_1.readJSON(path_1.join(config_1.CRAWL_FOLDER, timestamp, '_.json'));
    }
    getAllCrawlers() {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield fs_extra_1.readdir(config_1.CRAWL_FOLDER);
            const crawlers = yield Promise.all(folders.map(folder => fs_extra_1.readJSON(path_1.join(config_1.CRAWL_FOLDER, folder, '_.json'))));
            return crawlers;
        });
    }
    startCrawler(crawlerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cleanHistory();
            const timestamp = Math.floor(Date.now() / 1000);
            const id = md5(`${timestamp}-${crawlerInput.url}`);
            const crawler = Object.assign({}, crawlerInput, { timestamp,
                id });
            const distFolder = path_1.join(config_1.CRAWL_FOLDER, (timestamp).toString());
            yield fs_extra_1.mkdir(distFolder);
            yield fs_extra_1.mkdir(utils_1.getQueueFolder(distFolder));
            yield fs_extra_1.writeJSON(path_1.join(distFolder, '_.json'), crawler);
            const addedToqueue = yield utils_1.addToQueue(crawlerInput.url, distFolder);
            if (!addedToqueue) {
                throw (new Error('Something went wrong while adding job to queue'));
            }
            return {
                crawler,
                config: { MAX_HISTORY: config_1.MAX_HISTORY },
            };
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
//# sourceMappingURL=index.js.map