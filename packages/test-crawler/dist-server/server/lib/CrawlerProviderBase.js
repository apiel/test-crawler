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
    getRemote(remoteType) {
        if (remoteType === typing_1.RemoteType.Local) {
            return localRemote;
        }
        else if (remoteType === typing_1.RemoteType.GitHub) {
            return gitHubRemote;
        }
        throw new Error(`Unknown remote type ${remoteType}.`);
    }
    join(projectId, ...path) {
        return path_1.join(config_1.PROJECT_FOLDER, projectId, ...path);
    }
    readdir(remoteType, path) {
        const remote = this.getRemote(remoteType);
        return remote.readdir(path);
    }
    read(remoteType, path) {
        const remote = this.getRemote(remoteType);
        return remote.read(path);
    }
    blob(remoteType, path) {
        const remote = this.getRemote(remoteType);
        return remote.blob(path);
    }
    readJSON(remoteType, path) {
        const remote = this.getRemote(remoteType);
        return remote.readJSON(path);
    }
    saveFile(remoteType, file, content) {
        const remote = this.getRemote(remoteType);
        return remote.saveFile(file, content);
    }
    saveJSON(remoteType, file, content) {
        const remote = this.getRemote(remoteType);
        return remote.saveJSON(file, content);
    }
    remove(remoteType, file) {
        const remote = this.getRemote(remoteType);
        return remote.remove(file);
    }
    copy(remoteType, src, dst) {
        const remote = this.getRemote(remoteType);
        return remote.copy(src, dst);
    }
    crawl(remoteType, projectId, pagesFolder, consumeTimeout, push) {
        const crawlTarget = { projectId, pagesFolder };
        const remote = this.getRemote(remoteType);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
