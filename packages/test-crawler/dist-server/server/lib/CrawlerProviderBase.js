"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typing_1 = require("../typing");
const LocalRemote_1 = require("./remote/LocalRemote");
const GitHubRemote_1 = require("./remote/GitHubRemote");
const config_1 = require("./config");
const path_1 = require("path");
exports.LOCAL = true;
const gitHubRemote = new GitHubRemote_1.GitHubRemote();
const localRemote = new LocalRemote_1.LocalRemote();
class CrawlerProviderBase {
    getRemote(storageType) {
        if (storageType === typing_1.StorageType.Local) {
            return localRemote;
        }
        else if (storageType === typing_1.StorageType.GitHub) {
            return gitHubRemote;
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
