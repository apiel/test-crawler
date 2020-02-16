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
const Storage_1 = require("./Storage");
const fs_extra_1 = require("fs-extra");
const typing_1 = require("../../typing");
const crawl_1 = require("../crawl");
const path_1 = require("path");
const config_1 = require("../config");
class LocalStorage extends Storage_1.Storage {
    constructor(ctx) {
        super();
        this.ctx = ctx;
    }
    get browsers() {
        const browsers = [
            typing_1.Browser.ChromePuppeteer,
            typing_1.Browser.FirefoxSelenium,
            typing_1.Browser.ChromeSelenium,
        ];
        if (process.platform == 'darwin') {
            browsers.push(typing_1.Browser.SafariSelenium);
        }
        else if (process.platform == 'win32') {
            browsers.push(typing_1.Browser.IeSelenium);
        }
        return browsers;
    }
    readdir(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield fs_extra_1.pathExists(this.root(path))) {
                yield fs_extra_1.mkdirp(this.root(path));
                return fs_extra_1.readdir(this.root(path));
            }
            return [];
        });
    }
    read(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield fs_extra_1.pathExists(this.root(path))) {
                return fs_extra_1.readFile(this.root(path));
            }
        });
    }
    readJSON(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield fs_extra_1.pathExists(this.root(path))) {
                return fs_extra_1.readJSON(this.root(path));
            }
        });
    }
    blob(path) {
        return this.read(path);
    }
    saveJSON(file, data) {
        return fs_extra_1.outputJSON(this.root(file), data, { spaces: 4 });
    }
    saveFile(file, data) {
        return fs_extra_1.outputFile(this.root(file), data);
    }
    copy(src, dst) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield fs_extra_1.pathExists(this.root(src))) {
                return fs_extra_1.copy(this.root(src), this.root(dst), { overwrite: true });
            }
        });
    }
    copyBlob(src, dst) {
        return this.copy(src, dst);
    }
    remove(file) {
        return fs_extra_1.remove(this.root(file));
    }
    crawl(crawlTarget, consumeTimeout, push) {
        return __awaiter(this, void 0, void 0, function* () {
            yield crawl_1.crawl(crawlTarget, consumeTimeout, push);
            return undefined;
        });
    }
    root(...path) {
        return path_1.join(config_1.ROOT_FOLDER, ...path);
    }
    repos() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    getRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    jobs() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.LocalStorage = LocalStorage;
