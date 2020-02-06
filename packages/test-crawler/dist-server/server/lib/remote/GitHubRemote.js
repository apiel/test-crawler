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
const axios_1 = require("axios");
const BASE_URL = 'https://api.github.com';
const FOLDER = 'test-crawler';
class GitHubRemote extends Remote_1.Remote {
    constructor(config) {
        super();
        this.config = config;
    }
    read(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.call({
                url: `${this.contentsUrl}/${path}`,
            });
            return Buffer.from(response.data.content, 'base64');
        });
    }
    readJSON(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((yield this.read(projectId, path)).toString());
        });
    }
    call(config) {
        var _a;
        return axios_1.default(Object.assign(Object.assign({}, config), { headers: Object.assign(Object.assign({}, (_a = config) === null || _a === void 0 ? void 0 : _a.headers), { 'Authorization': `token ${this.config.token}` }) }));
    }
    get contentsUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/contents/${FOLDER}`;
    }
    get repoUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/${FOLDER}`;
    }
}
exports.GitHubRemote = GitHubRemote;
