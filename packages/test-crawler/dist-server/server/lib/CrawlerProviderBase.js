"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typing_1 = require("../typing");
const LocalStorage_1 = require("./storage/LocalStorage");
const GitHubStorage_1 = require("./storage/GitHubStorage");
const config_1 = require("./config");
const path_1 = require("path");
exports.LOCAL = true;
const gitHubStorage = new GitHubStorage_1.GitHubStorage();
const localStorage = new LocalStorage_1.LocalStorage();
class CrawlerProviderBase {
    getRemote(storageType) {
        if (storageType === typing_1.StorageType.Local) {
            return localStorage;
        }
        else if (storageType === typing_1.StorageType.GitHub) {
            return gitHubStorage;
        }
        throw new Error(`Unknown remote type ${storageType}.`);
    }
    join(projectId, ...path) {
        return path_1.join(config_1.PROJECT_FOLDER, projectId, ...path);
    }
    readdir(storageType, path) {
        const remote = this.getRemote(storageType);
        return remote.readdir(path);
    }
    read(storageType, path) {
        const remote = this.getRemote(storageType);
        return remote.read(path);
    }
    blob(storageType, path) {
        const remote = this.getRemote(storageType);
        return remote.blob(path);
    }
    readJSON(storageType, path) {
        const remote = this.getRemote(storageType);
        return remote.readJSON(path);
    }
    saveFile(storageType, file, content) {
        const remote = this.getRemote(storageType);
        return remote.saveFile(file, content);
    }
    saveJSON(storageType, file, content) {
        const remote = this.getRemote(storageType);
        return remote.saveJSON(file, content);
    }
    remove(storageType, file) {
        const remote = this.getRemote(storageType);
        return remote.remove(file);
    }
    copy(storageType, src, dst) {
        const remote = this.getRemote(storageType);
        return remote.copy(src, dst);
    }
    crawl(storageType, projectId, pagesFolder, consumeTimeout, push) {
        const crawlTarget = { projectId, pagesFolder };
        const remote = this.getRemote(storageType);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
