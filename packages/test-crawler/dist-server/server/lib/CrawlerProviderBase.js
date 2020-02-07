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
exports.LOCAL = true;
class CrawlerProviderBase {
    getRemote(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { remote } = yield this.loadProject(projectId);
            if (remote) {
                if (remote.type === typing_1.RemoteType.GitHub) {
                    return new GitHubRemote_1.GitHubRemote(remote);
                }
            }
            return this.getLocal(projectId);
        });
    }
    getLocal(projectId) {
        return new LocalRemote_1.LocalRemote(projectId);
    }
    readdir(projectId, path, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).readdir(path);
            }
            const remote = yield this.getRemote(projectId);
            return remote.readdir(path);
        });
    }
    read(projectId, path, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).read(path);
            }
            const remote = yield this.getRemote(projectId);
            return remote.read(path);
        });
    }
    readJSON(projectId, path, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).readJSON(path);
            }
            const remote = yield this.getRemote(projectId);
            return remote.readJSON(path);
        });
    }
    saveFile(projectId, file, content, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).saveFile(file, content);
            }
            const remote = yield this.getRemote(projectId);
            return remote.saveFile(file, content);
        });
    }
    saveJSON(projectId, file, content, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).saveJSON(file, content);
            }
            const remote = yield this.getRemote(projectId);
            return remote.saveJSON(file, content);
        });
    }
    remove(projectId, file, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).remove(file);
            }
            const remote = yield this.getRemote(projectId);
            return remote.remove(file);
        });
    }
    copy(projectId, src, dst, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (local) {
                return this.getLocal(projectId).copy(src, dst);
            }
            const remote = yield this.getRemote(projectId);
            return remote.copy(src, dst);
        });
    }
    crawl(projectId, pagesFolder, consumeTimeout, push, local = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlTarget = { projectId, pagesFolder };
            if (local) {
                return this.getLocal(projectId).crawl(crawlTarget, consumeTimeout, push);
            }
            const remote = yield this.getRemote(projectId);
            return remote.crawl(crawlTarget, consumeTimeout, push);
        });
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
