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
const nodegit_1 = require("nodegit");
class CrawlerGitProvider {
    getCrawler(git, timestamp) {
        return;
    }
    getAllCrawlers(git) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = yield nodegit_1.Repository.openExt(git.url);
            const commit = yield repo.getBranchCommit('master');
            const tree = yield commit.getTree();
            console.log('tree', tree);
            return [];
        });
    }
}
exports.CrawlerGitProvider = CrawlerGitProvider;
