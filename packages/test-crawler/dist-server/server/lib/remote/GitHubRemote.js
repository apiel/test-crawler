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
const Remote_1 = require("./Remote");
const path_1 = require("path");
const axios_1 = require("axios");
const config_1 = require("../config");
const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';
class GitHubRemote extends Remote_1.Remote {
    constructor() {
        super();
        if (!config_1.config.remote.github) {
            throw new Error('cannot use GitHub if no config provided');
        }
        this.config = config_1.config.remote.github;
    }
    readdir(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.getContents(path);
            return data.map(({ name }) => name);
        });
    }
    blob(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.getContents(path_1.dirname(path));
            const filename = path_1.basename(path);
            const filedata = data.find((item) => item.name === filename);
            if (!filedata) {
                return;
            }
            const { data: { content } } = yield this.call({
                url: `${this.blobUrl}/${filedata.sha}`,
            });
            return Buffer.from(content, 'base64');
        });
    }
    read(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { content } } = yield this.getContents(path);
            return Buffer.from(content, 'base64');
        });
    }
    readJSON(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return JSON.parse((yield this.read(path)).toString());
            }
            catch (error) {
                return undefined;
            }
        });
    }
    remove(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { sha } } = yield this.getContents(file);
            const data = JSON.stringify({
                message: `${COMMIT_PREFIX} save json`,
                sha,
            });
            yield this.call({
                method: 'DELETE',
                url: `${this.contentsUrl}/${file}`,
                data,
            });
        });
    }
    saveFile(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { sha } } = yield this.getContents(file);
            const data = JSON.stringify({
                message: `${COMMIT_PREFIX} save json`,
                content: Buffer.from(content).toString('base64'),
                sha,
            });
            yield this.call({
                method: 'PUT',
                url: `${this.contentsUrl}/${file}`,
                data,
            });
        });
    }
    saveJSON(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.saveFile(file, JSON.stringify(content, null, 4));
        });
    }
    copy(src, dst) {
        return __awaiter(this, void 0, void 0, function* () {
            const srcData = yield this.read(src);
            if (srcData) {
                this.saveFile(dst, srcData.toString());
            }
        });
    }
    crawl(crawlTarget, consumeTimeout, push) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('To be implemented');
        });
    }
    call(config) {
        var _a;
        return axios_1.default(Object.assign(Object.assign({}, config), { headers: Object.assign(Object.assign({}, (_a = config) === null || _a === void 0 ? void 0 : _a.headers), { 'Authorization': `token ${this.config.token}` }) }));
    }
    getContents(path) {
        return this.call({
            url: `${this.contentsUrl}/${path}`,
        });
    }
    get contentsUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/contents`;
    }
    get blobUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/git/blobs`;
    }
}
exports.GitHubRemote = GitHubRemote;
