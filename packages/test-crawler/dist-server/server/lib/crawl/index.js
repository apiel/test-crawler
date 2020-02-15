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
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const minimatch = require("minimatch");
const config_1 = require("../config");
const utils_1 = require("../utils");
const index_1 = require("../index");
const diff_1 = require("../diff");
const util_1 = require("util");
const CrawlerProvider_1 = require("../CrawlerProvider");
const rimraf = require("rimraf");
const axios_1 = require("axios");
const md5 = require("md5");
const storage_typing_1 = require("../../storage.typing");
const puppeteer_1 = require("./puppeteer");
let totalDiff = 0;
let totalError = 0;
let consumerRunning = 0;
const resultsQueue = [];
function getFolders(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER);
        yield fs_extra_1.mkdirp(projectFolder);
        const folders = yield fs_extra_1.readdir(projectFolder);
        folders.sort();
        return folders;
    });
}
exports.getFolders = getFolders;
function addToQueue(url, viewport, distFolder, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = md5(`${url}-${JSON.stringify(viewport)}`);
        const histFile = utils_1.getFilePath(id, distFolder)('json');
        const queueFile = utils_1.getFilePath(id, getQueueFolder(distFolder))('json');
        if (!(yield fs_extra_1.pathExists(queueFile)) && !(yield fs_extra_1.pathExists(histFile))) {
            if (!limit || (yield updateSiblingCount(url, distFolder)) < limit) {
                yield fs_extra_1.outputJson(queueFile, { url, id }, { spaces: 4 });
            }
            return true;
        }
        return false;
    });
}
exports.addToQueue = addToQueue;
function updateSiblingCount(url, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlPaths = url.split('/').filter(s => s);
        urlPaths.pop();
        const id = md5(urlPaths.join('/'));
        const file = path_1.join(distFolder, 'sibling', id);
        let count = 0;
        if (yield fs_extra_1.pathExists(file)) {
            count = parseInt((yield fs_extra_1.readFile(file)).toString(), 10) + 1;
        }
        yield fs_extra_1.outputFile(file, count);
        return count;
    });
}
function getQueueFolder(distFolder) {
    return path_1.join(distFolder, 'queue');
}
exports.getQueueFolder = getQueueFolder;
function loadPage(projectId, id, url, distFolder, retry = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        consumerRunning++;
        const filePath = utils_1.getFilePath(id, distFolder);
        const crawler = yield fs_extra_1.readJSON(path_1.join(distFolder, '_.json'));
        const { viewport, url: baseUrl, method, limit } = crawler;
        try {
            const _a = yield puppeteer_1.startPuppeteer(viewport, filePath, crawler, projectId, id, url, distFolder), { links } = _a, output = __rest(_a, ["links"]);
            yield fs_extra_1.outputJson(filePath('json'), output, { spaces: 4 });
            if (method !== index_1.CrawlerMethod.URLs && util_1.isArray(links)) {
                const siteUrls = links.filter(href => href.indexOf(baseUrl) === 0);
                yield addUrls(siteUrls, viewport, distFolder, limit);
            }
            const result = yield diff_1.prepare(projectId, id, distFolder, crawler);
            resultsQueue.push({
                result,
                folder: distFolder,
                isError: !!output.error,
            });
        }
        catch (err) {
            logol_1.error(`Load page error (attempt ${retry + 1})`, err.toString());
            if (retry < 2) {
                logol_1.warn('Retry crawl', url);
                yield loadPage(projectId, id, url, distFolder, retry + 1);
            }
            else {
                yield fs_extra_1.outputJson(filePath('json'), { url, id, error: err.toString() }, { spaces: 4 });
                resultsQueue.push({
                    folder: distFolder,
                    isError: true,
                });
            }
            consumerRunning--;
        }
        consumerRunning--;
    });
}
function injectCodes(page, projectId, id, url, links, distFolder, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new CrawlerProvider_1.CrawlerProvider(storage_typing_1.StorageType.Local);
        const list = yield crawlerProvider.getCodeList(projectId, true);
        const toInject = Object.values(list).filter(({ pattern }) => {
            return minimatch(url, pattern);
        });
        logol_1.info(toInject.length, 'code(s) to inject for', url);
        for (const codeInfo of toInject) {
            const sourcePath = path_1.join(config_1.ROOT_FOLDER, config_1.PROJECT_FOLDER, projectId, config_1.CODE_FOLDER, `${codeInfo.id}.js`);
            links = yield injectCode(sourcePath, page, id, url, links, distFolder, crawler);
        }
        return links;
    });
}
exports.injectCodes = injectCodes;
function injectCode(jsFile, page, id, url, links, distFolder, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(jsFile)) {
            logol_1.info('Inject code', url, links);
            const fn = require(jsFile);
            const newLinks = yield fn(page, url, links, id, crawler, distFolder);
            return newLinks || links;
        }
        return links;
    });
}
function addUrls(urls, viewport, distFolder, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        for (const url of urls) {
            if (yield addToQueue(url, viewport, distFolder, limit)) {
                count++;
            }
        }
        if (count > 0) {
            logol_1.info('Add urls', `found ${urls.length}, add ${count}`);
        }
    });
}
;
function pickFromQueue(projectId, pagesFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const distFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, pagesFolder);
        const queueFolder = getQueueFolder(distFolder);
        if (yield fs_extra_1.pathExists(queueFolder)) {
            const [file] = yield fs_extra_1.readdir(queueFolder);
            if (file) {
                logol_1.info('Crawl', file);
                try {
                    const queueFile = path_1.join(queueFolder, file);
                    const { id, url } = yield fs_extra_1.readJSON(queueFile);
                    const filePath = utils_1.getFilePath(id, distFolder);
                    yield fs_extra_1.move(queueFile, filePath('json'));
                    return { projectId, id, url, distFolder };
                }
                catch (error) {
                    logol_1.warn('Crawl possible error', error);
                }
            }
        }
    });
}
function pickFromQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFolders = yield fs_extra_1.readdir(config_1.PROJECT_FOLDER);
        for (const projectId of projectFolders) {
            const crawlFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER);
            yield fs_extra_1.mkdirp(crawlFolder);
            const pagesFolders = yield fs_extra_1.readdir(crawlFolder);
            for (const pagesFolder of pagesFolders) {
                const toCrawl = yield pickFromQueue(projectId, pagesFolder);
                if (toCrawl) {
                    return toCrawl;
                }
            }
        }
    });
}
let consumeQueuesRetry = 0;
function consumeQueues(consumeTimeout, crawlTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        if (consumerRunning < config_1.CONSUMER_COUNT) {
            let toCrawl;
            if (crawlTarget) {
                toCrawl = yield pickFromQueue(crawlTarget.projectId, crawlTarget.pagesFolder);
            }
            else {
                toCrawl = yield pickFromQueues();
            }
            if (toCrawl) {
                consumeQueuesRetry = 0;
                const { projectId, id, url, distFolder } = toCrawl;
                loadPage(projectId, id, url, distFolder);
                consumeQueues(consumeTimeout, crawlTarget);
                return;
            }
        }
        if (!consumeTimeout || consumeQueuesRetry < consumeTimeout) {
            consumeQueuesRetry++;
            setTimeout(() => consumeQueues(consumeTimeout, crawlTarget), 500);
        }
        else {
            logol_1.info('consumeQueues timeout');
        }
    });
}
let consumeResultRetry = 0;
function consumeResults(consumeTimeout, push) {
    return __awaiter(this, void 0, void 0, function* () {
        if (resultsQueue.length) {
            consumeResultRetry = 0;
            const [{ folder, result, isError }] = resultsQueue.splice(0, 1);
            const file = path_1.join(folder, '_.json');
            const crawler = yield fs_extra_1.readJSON(file);
            if (result) {
                crawler.diffZoneCount += result.diffZoneCount;
                totalDiff += result.diffZoneCount;
            }
            if (isError) {
                crawler.errorCount++;
                totalError++;
            }
            const queueFolder = getQueueFolder(folder);
            const filesInQueue = (yield fs_extra_1.pathExists(queueFolder)) ? yield fs_extra_1.readdir(queueFolder) : [];
            crawler.inQueue = filesInQueue.length;
            crawler.urlsCount = (yield fs_extra_1.readdir(folder)).filter(f => path_1.extname(f) === '.json' && f !== '_.json').length;
            crawler.lastUpdate = Date.now();
            yield fs_extra_1.writeJSON(file, crawler, { spaces: 4 });
            push && push(crawler);
            consumeResults(consumeTimeout, push);
        }
        else if (!consumeTimeout || consumeResultRetry < consumeTimeout) {
            consumeResultRetry++;
            setTimeout(() => consumeResults(consumeTimeout, push), 1000);
        }
        else {
            logol_1.info('consumeResults timeout');
            afterAll();
        }
    });
}
function prepareFolders() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(config_1.PROJECT_FOLDER))) {
            yield fs_extra_1.mkdirp(config_1.PROJECT_FOLDER);
        }
        return cleanHistory();
    });
}
function cleanHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const projects = yield fs_extra_1.readdir(config_1.PROJECT_FOLDER);
        for (const project of projects) {
            const crawlFolder = path_1.join(config_1.PROJECT_FOLDER, project, config_1.CRAWL_FOLDER);
            if (yield fs_extra_1.pathExists(crawlFolder)) {
                const results = yield fs_extra_1.readdir(crawlFolder);
                const cleanUp = results.slice(0, -(config_1.MAX_HISTORY - 1));
                for (const toRemove of cleanUp) {
                    yield util_1.promisify(rimraf)(path_1.join(crawlFolder, toRemove));
                }
            }
        }
    });
}
function startCrawler({ projectId, pagesFolder }) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerProvider = new CrawlerProvider_1.CrawlerProvider(storage_typing_1.StorageType.Local);
        const { crawlerInput } = yield crawlerProvider.loadProject(projectId);
        const id = md5(`${pagesFolder}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);
        const crawler = Object.assign(Object.assign({}, crawlerInput), { timestamp: pagesFolder, id, diffZoneCount: 0, errorCount: 0, status: 'review', inQueue: 1, urlsCount: 0, startAt: Date.now(), lastUpdate: Date.now() });
        const distFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, pagesFolder);
        yield fs_extra_1.outputJSON(path_1.join(distFolder, '_.json'), crawler, { spaces: 4 });
        if (crawlerInput.method === index_1.CrawlerMethod.URLs) {
            yield startUrlsCrawling(crawlerInput, distFolder);
        }
        else {
            yield startSpiderBotCrawling(crawlerInput, distFolder);
        }
    });
}
function startUrlsCrawling(crawlerInput, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(crawlerInput.url);
        const urls = data.split(`\n`).filter((url) => url.trim());
        yield Promise.all(urls.map((url) => addToQueue(url, crawlerInput.viewport, distFolder)));
    });
}
function startSpiderBotCrawling({ url, viewport, limit }, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const addedToqueue = yield addToQueue(url, viewport, distFolder, limit);
        if (!addedToqueue) {
            throw (new Error('Something went wrong while adding job to queue'));
        }
    });
}
let projectIdForExit;
function beforeAll(crawlTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        if (crawlTarget) {
            try {
                projectIdForExit = crawlTarget.projectId;
                const jsFile = path_1.join(config_1.ROOT_FOLDER, config_1.PROJECT_FOLDER, crawlTarget.projectId, 'before.js');
                if (yield fs_extra_1.pathExists(jsFile)) {
                    const fn = require(jsFile);
                    yield fn();
                }
            }
            catch (err) {
                logol_1.error('Something went wrong in beforeAll script', err);
            }
        }
    });
}
function afterAll() {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Done', { totalDiff, totalError });
        if (projectIdForExit) {
            try {
                const jsFile = path_1.join(config_1.ROOT_FOLDER, config_1.PROJECT_FOLDER, projectIdForExit, 'after.js');
                if (yield fs_extra_1.pathExists(jsFile)) {
                    const fn = require(jsFile);
                    fn(totalDiff, totalError);
                }
            }
            catch (err) {
                logol_1.error('Something went wrong in afterAll script', err);
            }
        }
    });
}
function crawl(crawlTarget, consumeTimeout = config_1.CONSUME_TIMEOUT, push) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepareFolders();
        yield beforeAll(crawlTarget);
        crawlTarget && startCrawler(crawlTarget);
        consumeQueuesRetry = 0;
        consumeResultRetry = 0;
        consumeResults(consumeTimeout, push);
        consumeQueues(consumeTimeout, crawlTarget);
    });
}
exports.crawl = crawl;
