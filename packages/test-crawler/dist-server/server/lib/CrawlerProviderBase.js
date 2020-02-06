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
const local = new LocalRemote_1.LocalRemote();
class CrawlerProviderBase {
    getRemote(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { remote } = yield this.loadProject(projectId);
            if (remote) {
                if (remote.type === typing_1.RemoteType.GitHub) {
                    return new GitHubRemote_1.GitHubRemote(remote);
                }
            }
            return local;
        });
    }
    read(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId);
            return remote.read(projectId, path);
        });
    }
    readLocal(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return local.read(projectId, path);
        });
    }
    readJSON(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = yield this.getRemote(projectId);
            return remote.readJSON(projectId, path);
        });
    }
    readJSONLocal(projectId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return local.readJSON(projectId, path);
        });
    }
}
exports.CrawlerProviderBase = CrawlerProviderBase;
