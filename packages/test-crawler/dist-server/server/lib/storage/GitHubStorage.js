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
const typing_1 = require("../../typing");
const config_1 = require("../config");
const error_1 = require("../../error");
const CrawlerProviderStorage_1 = require("../CrawlerProviderStorage");
const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';
const EVENT_TYPE = 'test-crawler';
const CI_Workflow_main = `
name: Test-crawler CI

on:
  repository_dispatch:
    types: [${EVENT_TYPE}_main]

jobs:
  test-crawler:
    if: github.event.client_payload.os == 'default'
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v2
    - name: Enable safari driver
      run: |
        sudo safaridriver --enable
        safaridriver -p 0 &
    - name: Run test-crawler \${{ github.event.client_payload.projectId }}
      uses: apiel/test-crawler/actions/run@master
    - name: Push changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: \${{ secrets.GITHUB_TOKEN }}

  test-crawler-windows:
    if: github.event.client_payload.os == 'win'
    runs-on: windows-latest

    steps:
    - uses: actions/checkout@v2
    - uses: warrenbuckley/Setup-Nuget@v1
    - name: Enable ie driver
      run: |
        nuget install Selenium.WebDriver.IEDriver -Version 3.150.0
        # nuget install Selenium.WebDriver.MicrosoftDriver -Version 17.17134.0
        # nuget install Selenium.WebDriver.MicrosoftWebDriver -Version 10.0.17134
    - name: Run test-crawler \${{ github.event.client_payload.projectId }}
      uses: apiel/test-crawler/actions/run@master
    - name: Push changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: \${{ secrets.GITHUB_TOKEN }}
`;
const CI_Workflow_apply_changes = `
name: Test-crawler CI apply changes

on:
  repository_dispatch:
    types: [${EVENT_TYPE}_apply_changes]

jobs:
  test-crawler:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Apply changes
      uses: apiel/test-crawler/actions/apply-changes@master
    - name: Push changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: \${{ secrets.GITHUB_TOKEN }}

`;
class GitHubStorage extends Storage_1.Storage {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.config = config_1.config.remote.github;
    }
    get browsers() {
        return Object.values(typing_1.Browser);
    }
    applyChanges(changes) {
        return this.dispatch(CI_Workflow_apply_changes, 'apply_changes', {
            changes,
        });
    }
    crawl(crawlTarget, consumeTimeout, push, browser) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = crawlTarget) === null || _a === void 0 ? void 0 : _a.projectId) {
                const os = browser === typing_1.Browser.IeSelenium ? 'win' : 'default';
                yield this.dispatch(CI_Workflow_main, 'main', {
                    projectId: crawlTarget.projectId,
                    os,
                });
            }
            return this.redirectUrl;
        });
    }
    readdir(path) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.getContents(path);
                return data.map(({ name }) => name);
            }
            catch (error) {
                if (((_b = (_a = error) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                    return [];
                }
                throw error;
            }
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
    saveBlob(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.remove(file);
            const { data: [{ sha: latestCommitSha, commit: { tree: { sha: base_tree } } }] } = yield this.call({
                url: `${this.baseRepo}/commits`,
            });
            const { data: { sha: newBlobSha } } = yield this.call({
                method: 'POST',
                url: this.blobUrl,
                data: {
                    content: content.toString('base64'),
                    encoding: 'base64',
                },
            });
            const { data: { sha: newTreeSha } } = yield this.call({
                method: 'POST',
                url: `${this.baseRepo}/git/trees`,
                data: {
                    base_tree,
                    tree: [{
                            path: file,
                            mode: '100644',
                            sha: newBlobSha,
                        }],
                },
            });
            const { data: { sha: shaCommit } } = yield this.call({
                method: 'POST',
                url: `${this.baseRepo}/git/commits`,
                data: {
                    message: `${COMMIT_PREFIX} save blob`,
                    tree: newTreeSha,
                    parents: [latestCommitSha]
                },
            });
            return this.call({
                method: 'PATCH',
                url: `${this.baseRepo}/git/refs/heads/master`,
                data: {
                    sha: shaCommit,
                },
            });
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
            if (!this.repo) {
                throw new Error('GitHub repository required.');
            }
            const sha = yield this.getSha(file);
            const data = JSON.stringify(Object.assign({ message: `${COMMIT_PREFIX} save file`, content: Buffer.from(content).toString('base64') }, (sha && { sha })));
            yield this.call({
                method: 'PUT',
                url: `${this.contentsUrl}/${file}`,
                data,
            });
        });
    }
    getSha(file) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.getContents(file);
                if ((_a = data) === null || _a === void 0 ? void 0 : _a.sha) {
                    return data.sha;
                }
            }
            catch (error) {
                if (((_c = (_b = error) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.status) !== 404) {
                    throw error;
                }
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
    copyBlob(src, dst) {
        return __awaiter(this, void 0, void 0, function* () {
            const srcData = yield this.blob(src);
            if (srcData) {
                yield this.saveBlob(dst, srcData);
            }
        });
    }
    repos() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.call({
                url: `${BASE_URL}/users/${(_a = this.config) === null || _a === void 0 ? void 0 : _a.user}/repos?sort=updated&per_page=1000`,
            });
            return data.map(({ name }) => name);
        });
    }
    getRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo;
        });
    }
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { rate: { limit, remaining } } } = yield this.call({
                url: `${BASE_URL}/rate_limit`,
            });
            return `For GitHub API requests, you can make up to 5000 requests per hour.
        Every pages of the test-crawler UI is using multiples request at once. Your
        current rate limit is: ${remaining} of ${limit}`;
        });
    }
    jobs(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { workflow_runs } } = yield this.call({
                url: this.runsUrl,
            });
            const inProgress = yield this.getInProgressJobs(projectId, workflow_runs);
            const queued = this.getQueuedJobs(workflow_runs);
            return [...queued, ...inProgress];
        });
    }
    dispatch(workflow, suffix, client_payload = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveFile(`.github/workflows/test-crawler_${suffix}.yml`, workflow);
            yield this.call({
                method: 'POST',
                url: `${this.ciDispatchUrl}`,
                data: {
                    event_type: `${EVENT_TYPE}_${suffix}`,
                    client_payload,
                },
            });
        });
    }
    getQueuedJobs(runs) {
        return runs.filter(({ status }) => !['in_progress', 'completed'].includes(status))
            .map(({ id, html_url, status, created_at, updated_at }) => ({
            id,
            url: html_url,
            status,
            startAt: Math.round(new Date(created_at).getTime() / 1000),
            lastUpdate: Math.round(new Date(updated_at).getTime() / 1000),
        }));
    }
    getInProgressJobs(projectId, runs) {
        return __awaiter(this, void 0, void 0, function* () {
            const progressIds = runs.filter(({ status }) => status === 'in_progress').map(({ id }) => id);
            const jobs = progressIds.map((id) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { data: { jobs } } = yield this.call({
                    url: `${this.baseRepo}/actions/runs/${id}/jobs`,
                });
                const [job] = jobs;
                const isProjectJob = job.steps.find(({ name }) => name.includes(projectId)) !== undefined;
                if (isProjectJob) {
                    const step = job.steps.find(({ status }) => status === 'in_progress');
                    return {
                        id,
                        url: job.html_url,
                        status: job.status,
                        startAt: Math.round(new Date(job.started_at).getTime() / 1000),
                        stepsCount: job.steps.length,
                        stepsDone: job.steps.filter(({ status }) => status === 'completed').length,
                        currentStep: ((_a = step) === null || _a === void 0 ? void 0 : _a.name) || 'unknown',
                        lastUpdate: Math.round(new Date(((_b = step) === null || _b === void 0 ? void 0 : _b.started_at) || job.started_at).getTime() / 1000),
                    };
                }
            }));
            return (yield Promise.all(jobs)).filter(job => job);
        });
    }
    call(config) {
        var _a;
        if (!this.token || !this.user) {
            throw new Error(error_1.ERR.missingGitHubConfig);
        }
        return axios_1.default(Object.assign(Object.assign({}, config), { headers: Object.assign(Object.assign({}, (_a = config) === null || _a === void 0 ? void 0 : _a.headers), { 'Authorization': `token ${this.token}` }) }));
    }
    getContents(path) {
        return this.call({
            url: `${this.contentsUrl}/${path}`,
        });
    }
    get baseRepo() {
        return `${BASE_URL}/repos/${this.user}/${this.repo}`;
    }
    get contentsUrl() {
        return `${this.baseRepo}/contents`;
    }
    get blobUrl() {
        return `${this.baseRepo}/git/blobs`;
    }
    get ciDispatchUrl() {
        return `${this.baseRepo}/dispatches`;
    }
    get runsUrl() {
        return `${this.baseRepo}/actions/workflows/test-crawler.yml/runs?event=repository_dispatch`;
    }
    get redirectUrl() {
        return `https://github.com/${this.user}/${this.repo}/actions`;
    }
    get user() {
        var _a, _b;
        return ((_a = CrawlerProviderStorage_1.getCookie('github', this.ctx)) === null || _a === void 0 ? void 0 : _a.user) || ((_b = this.config) === null || _b === void 0 ? void 0 : _b.user);
    }
    get token() {
        var _a, _b;
        return ((_a = CrawlerProviderStorage_1.getCookie('github', this.ctx)) === null || _a === void 0 ? void 0 : _a.token) || ((_b = this.config) === null || _b === void 0 ? void 0 : _b.user);
    }
    get repo() {
        var _a;
        return CrawlerProviderStorage_1.getCookie('githubRepo', this.ctx) || ((_a = this.config) === null || _a === void 0 ? void 0 : _a.defaultRepo);
    }
}
exports.GitHubStorage = GitHubStorage;
