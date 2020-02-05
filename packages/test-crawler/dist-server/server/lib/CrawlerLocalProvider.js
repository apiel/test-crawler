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
const fs_extra_1 = require("fs-extra");
const config_1 = require("./config");
const path_1 = require("path");
class CrawlerLocalProvider {
    getCrawler(projectId, timestamp) {
        return fs_extra_1.readJSON(path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, '_.json'));
    }
    getAllCrawlers(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER);
            yield fs_extra_1.mkdirp(projectFolder);
            const folders = yield fs_extra_1.readdir(projectFolder);
            const crawlers = yield Promise.all(folders.map(timestamp => this.getCrawler(projectId, timestamp)));
            return crawlers;
        });
    }
}
exports.CrawlerLocalProvider = CrawlerLocalProvider;
