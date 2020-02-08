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
        return __awaiter(this, void 0, void 0, function* () {
            const remote = this.getRemote(remoteType);
            return remote.read(path);
        });
    }
    readJSON(remoteType, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = this.getRemote(remoteType);
            return remote.readJSON(path);
        });
    }
    saveFile(remoteType, file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = this.getRemote(remoteType);
            return remote.saveFile(file, content);
        });
    }
    saveJSON(remoteType, file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = this.getRemote(remoteType);
            return remote.saveJSON(file, content);
        });
    }
    remove(remoteType, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = this.getRemote(remoteType);
            return remote.remove(file);
        });
    }
    copy(remoteType, src, dst) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = this.getRemote(remoteType);
            return remote.copy(src, dst);
        });
    }
    crawl(remoteType, projectId, pagesFolder, consumeTimeout, push) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlTarget = { projectId, pagesFolder };
            const remote = this.getRemote(remoteType);
            return remote.crawl(crawlTarget, consumeTimeout, push);
        });
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
