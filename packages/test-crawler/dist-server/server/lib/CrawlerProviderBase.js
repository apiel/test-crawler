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
    getRemote(projectId, forceLocal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!forceLocal) {
                const { remote } = yield this.loadProject(projectId);
                if (remote) {
                    if (remote.type === typing_1.RemoteType.GitHub) {
                        return gitHubRemote;
                    }
                }
            }
            return localRemote;
        });
    }
    join(projectId, ...path) {
        return path_1.join(config_1.PROJECT_FOLDER, projectId, ...path);
    }
    readdir(projectId, path, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.readdir(path);
        });
    }
    read(projectId, path, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.read(path);
        });
    }
    readJSON(projectId, path, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.readJSON(path);
        });
    }
    saveFile(projectId, file, content, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.saveFile(file, content);
        });
    }
    saveJSON(projectId, file, content, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.saveJSON(file, content);
        });
    }
    remove(projectId, file, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.remove(file);
        });
    }
    copy(projectId, src, dst, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.copy(src, dst);
        });
    }
    crawl(projectId, pagesFolder, consumeTimeout, push, forceLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlTarget = { projectId, pagesFolder };
            const remote = yield this.getRemote(projectId, forceLocal);
            return remote.crawl(crawlTarget, consumeTimeout, push);
        });
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
