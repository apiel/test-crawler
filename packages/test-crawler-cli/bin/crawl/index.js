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
const puppeteer_1 = require("puppeteer");
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config_1 = require("test-crawler-lib/lib/config");
const utils_1 = require("test-crawler-lib/lib/utils");
const lib_1 = require("test-crawler-lib/lib");
const diff_1 = require("../diff");
let totalDiff = 0;
let consumerRunning = 0;
const resultsQueue = [];
function loadPage(id, url, distFolder, retry = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        consumerRunning++;
        let hrefs;
        const filePath = utils_1.getFilePath(id, distFolder);
        const basePath = utils_1.getFilePath(id, config_1.BASE_FOLDER);
        const crawler = yield fs_extra_1.readJSON(path_1.join(distFolder, '_.json'));
        const { viewport, url: baseUrl, method } = crawler;
        const browser = yield puppeteer_1.launch({});
        const page = yield browser.newPage();
        yield page.setUserAgent(config_1.USER_AGENT);
        yield page.setViewport(viewport);
        try {
            yield page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: config_1.TIMEOUT,
            });
            const html = yield page.content();
            yield fs_extra_1.writeFile(filePath('html'), html);
            const metrics = yield page.metrics();
            const performance = JSON.parse(yield page.evaluate(() => JSON.stringify(window.performance)));
            yield injectCode(basePath('js'), page, id, url, distFolder);
            yield page.screenshot({ path: filePath('png'), fullPage: true });
            const png = { width: viewport.width };
            yield utils_1.savePageInfo(filePath('json'), { url, id, performance, metrics, png, viewport, baseUrl });
            if (method !== lib_1.CrawlerMethod.URLs) {
                hrefs = yield page.$$eval('a', as => as.map(a => a.href));
                const urls = hrefs.filter(href => href.indexOf(baseUrl) === 0);
                yield addUrls(urls, viewport, distFolder);
            }
            const result = yield diff_1.prepare(id, distFolder, crawler);
            resultsQueue.push({
                result,
                folder: distFolder,
            });
        }
        catch (err) {
            logol_1.error(`Load page error (attempt ${retry + 1})`, err.toString());
            if (retry < 2) {
                logol_1.warn('Retry crawl', url);
                yield loadPage(id, url, distFolder, retry + 1);
            }
            else {
                yield utils_1.savePageInfo(filePath('json'), { url, id, error: err.toString() });
                resultsQueue.push({
                    folder: distFolder,
                    isError: true,
                });
            }
            consumerRunning--;
        }
        yield browser.close();
        logol_1.info('browser closed', url);
        consumerRunning--;
    });
}
function injectCode(jsFile, page, id, url, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(jsFile)) {
            logol_1.info('Inject code', id);
            try {
                const fn = require(jsFile);
                yield fn(page, url, id, distFolder);
            }
            catch (err) {
                logol_1.error('Something went wrong while injecting the code', id, err);
            }
        }
    });
}
function addUrls(urls, viewport, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        for (const url of urls) {
            if (yield utils_1.addToQueue(url, viewport, distFolder)) {
                count++;
            }
        }
        if (count > 0) {
            logol_1.info('Add urls', `found ${urls.length}, add ${count}`);
        }
    });
}
function pickFromQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const pagesFolders = yield fs_extra_1.readdir(config_1.CRAWL_FOLDER);
        for (const pagesFolder of pagesFolders) {
            const distFolder = path_1.join(config_1.CRAWL_FOLDER, pagesFolder);
            const queueFolder = utils_1.getQueueFolder(distFolder);
            if (yield fs_extra_1.pathExists(queueFolder)) {
                const [file] = yield fs_extra_1.readdir(queueFolder);
                if (file) {
                    logol_1.info('Crawl', file);
                    const queueFile = path_1.join(queueFolder, file);
                    const { id, url } = yield fs_extra_1.readJSON(queueFile);
                    const filePath = utils_1.getFilePath(id, distFolder);
                    yield fs_extra_1.move(queueFile, filePath('json'));
                    return { id, url, distFolder };
                }
            }
        }
    });
}
function consumeQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        if (consumerRunning < config_1.CONSUMER_COUNT) {
            const toCrawl = yield pickFromQueues();
            if (toCrawl) {
                const { id, url, distFolder } = toCrawl;
                loadPage(id, url, distFolder);
            }
            consumeQueues();
        }
        else {
            setTimeout(consumeQueues, 200);
        }
    });
}
let processTimeoutTimer;
function processTimeout() {
    if (config_1.PROCESS_TIMEOUT) {
        clearTimeout(processTimeoutTimer);
        processTimeoutTimer = setTimeout(() => {
            logol_1.info('Process timeout, exit', `${config_1.PROCESS_TIMEOUT} sec inactivity`);
            process.exit(totalDiff);
        }, config_1.PROCESS_TIMEOUT * 1000);
    }
}
function consumeResults() {
    return __awaiter(this, void 0, void 0, function* () {
        if (resultsQueue.length) {
            const [{ folder, result, isError }] = resultsQueue.splice(0, 1);
            const file = path_1.join(folder, '_.json');
            const crawler = yield fs_extra_1.readJSON(file);
            if (result) {
                crawler.diffZoneCount += result.diffZoneCount;
                totalDiff += result.diffZoneCount;
            }
            if (isError) {
                crawler.errorCount++;
            }
            const queueFolder = utils_1.getQueueFolder(folder);
            const filesInQueue = (yield fs_extra_1.pathExists(queueFolder)) ? yield fs_extra_1.readdir(queueFolder) : [];
            crawler.inQueue = filesInQueue.length;
            crawler.urlsCount = (yield fs_extra_1.readdir(folder)).filter(f => path_1.extname(f) === '.json' && f !== '_.json').length;
            crawler.lastUpdate = Date.now();
            yield fs_extra_1.writeJSON(file, crawler, { spaces: 4 });
            consumeResults();
            processTimeout();
        }
        else {
            setTimeout(consumeResults, 1000);
        }
    });
}
function prepareFolders() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(config_1.CRAWL_FOLDER))) {
            yield fs_extra_1.mkdirp(config_1.CRAWL_FOLDER);
        }
        if (!(yield fs_extra_1.pathExists(config_1.BASE_FOLDER))) {
            yield fs_extra_1.mkdirp(config_1.BASE_FOLDER);
        }
    });
}
function crawl() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepareFolders();
        consumeResults();
        consumeQueues();
        processTimeout();
    });
}
exports.crawl = crawl;
//# sourceMappingURL=index.js.map