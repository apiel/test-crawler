"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const path_1 = require("path");
const CrawlerProviderStorage_1 = require("./CrawlerProviderStorage");
class CrawlerProviderBase extends CrawlerProviderStorage_1.CrawlerProviderStorage {
    repos(storageType) {
        const remote = this.getStorage(storageType);
        return remote.repos();
    }
    repo(storageType) {
        const remote = this.getStorage(storageType);
        return remote.repo();
    }
    info(storageType) {
        const remote = this.getStorage(storageType);
        return remote.info();
    }
    join(projectId, ...path) {
        return path_1.join(config_1.PROJECT_FOLDER, projectId, ...path);
    }
    readdir(storageType, path) {
        const remote = this.getStorage(storageType);
        return remote.readdir(path);
    }
    read(storageType, path) {
        const remote = this.getStorage(storageType);
        return remote.read(path);
    }
    blob(storageType, path) {
        const remote = this.getStorage(storageType);
        return remote.blob(path);
    }
    readJSON(storageType, path) {
        const remote = this.getStorage(storageType);
        return remote.readJSON(path);
    }
    saveFile(storageType, file, content) {
        const remote = this.getStorage(storageType);
        return remote.saveFile(file, content);
    }
    saveJSON(storageType, file, content) {
        const remote = this.getStorage(storageType);
        return remote.saveJSON(file, content);
    }
    remove(storageType, file) {
        const remote = this.getStorage(storageType);
        return remote.remove(file);
    }
    copy(storageType, src, dst) {
        const remote = this.getStorage(storageType);
        return remote.copy(src, dst);
    }
    crawl(storageType, projectId, pagesFolder, consumeTimeout, push) {
        const crawlTarget = { projectId, pagesFolder };
        const remote = this.getStorage(storageType);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
