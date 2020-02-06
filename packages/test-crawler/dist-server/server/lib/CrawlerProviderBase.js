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
    readdir(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId);
            return remote.readdir(path);
        });
    }
    readdirLocal(projectId, path) {
        return this.getLocal(projectId).readdir(path);
    }
    read(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId);
            return remote.read(path);
        });
    }
    readLocal(projectId, path) {
        return this.getLocal(projectId).read(path);
    }
    readJSON(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId);
            return remote.readJSON(path);
        });
    }
    readJSONLocal(projectId, path) {
        return this.getLocal(projectId).readJSON(path);
    }
    saveJSON(projectId, file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId);
            return remote.saveJSON(file, content);
        });
    }
    saveJSONLocal(projectId, file, content) {
        return this.getLocal(projectId).saveJSON(file, content);
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
