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
const path_1 = require("path");
const axios_1 = require("axios");
const config_1 = require("../config");
const error_1 = require("../../error");
const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';
const CI_Workflow = `
name: Test-crawler CI

on: [repository_dispatch]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup node
      uses: actions/setup-node@v1
    - name: Run test-crawler \${{ github.event.client_payload.projectId }}
      run: |
        ROOT_FOLDER=\`pwd\` npx -p test-crawler test-crawler-cli --project \${{ github.event.client_payload.projectId }}
    - name: Commit changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "Test-crawler"
        git add .
        git status
        git commit -m "[test-crawler] CI save" || echo "No changes to commit"
        git pull
        git push "https://\${{ secrets.GITHUB_TOKEN }}@github.com/\${{ github.repository }}"
`;
class GitHubStorage extends Storage_1.Storage {
    constructor() {
        super();
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
            try {
                const sha = yield this.getSha(file);
                const data = JSON.stringify(Object.assign({ message: `${COMMIT_PREFIX} save file`, content: Buffer.from(content).toString('base64') }, (sha && { sha })));
                const { data: res } = yield this.call({
                    method: 'PUT',
                    url: `${this.contentsUrl}/${file}`,
                    data,
                });
                console.log('result save file', res);
            }
            catch (error) {
                console.error('something went wrong in save file', error.toString());
            }
        });
    }
    getSha(file) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.getContents(file);
                if ((_a = data) === null || _a === void 0 ? void 0 : _a.sha) {
                    return data.sha;
                }
            }
            catch (error) {
                console.error('something went wrong while getting sha', error.toString());
            }
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = crawlTarget) === null || _a === void 0 ? void 0 : _a.projectId) {
                yield this.saveFile('.github/workflows/test-crawler.yml', CI_Workflow);
                yield this.call({
                    method: 'POST',
                    url: `${this.ciDispatchUrl}`,
                    data: {
                        event_type: "test-crawler",
                        client_payload: {
                            projectId: crawlTarget.projectId,
                        }
                    },
                });
            }
        });
    }
    call(config) {
        var _a;
        if (!this.config) {
            throw new Error(error_1.ERR.missingGitHubConfig);
        }
        return axios_1.default(Object.assign(Object.assign({}, config), { headers: Object.assign(Object.assign({}, (_a = config) === null || _a === void 0 ? void 0 : _a.headers), { 'Authorization': `token ${this.config.token}` }) }));
    }
    getContents(path) {
        return this.call({
            url: `${this.contentsUrl}/${path}`,
        });
    }
    get contentsUrl() {
        var _a, _b;
        return `${BASE_URL}/repos/${(_a = this.config) === null || _a === void 0 ? void 0 : _a.user}/${(_b = this.config) === null || _b === void 0 ? void 0 : _b.repo}/contents`;
    }
    get blobUrl() {
        var _a, _b;
        return `${BASE_URL}/repos/${(_a = this.config) === null || _a === void 0 ? void 0 : _a.user}/${(_b = this.config) === null || _b === void 0 ? void 0 : _b.repo}/git/blobs`;
    }
    get ciDispatchUrl() {
        var _a, _b;
        return `${BASE_URL}/repos/${(_a = this.config) === null || _a === void 0 ? void 0 : _a.user}/${(_b = this.config) === null || _b === void 0 ? void 0 : _b.repo}/dispatches`;
    }
}
exports.GitHubStorage = GitHubStorage;
