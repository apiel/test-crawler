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
const universal_cookie_1 = require("universal-cookie");
const GitHubStorage_1 = require("./storage/GitHubStorage");
const CrawlerProviderStorageBase_1 = require("./CrawlerProviderStorageBase");
const gitHubStorage = new GitHubStorage_1.GitHubStorage();
function getCookie(key, ctx) {
    const cookies = new universal_cookie_1.default();
    return cookies.get(key);
}
exports.getCookie = getCookie;
class CrawlerProviderStorage extends CrawlerProviderStorageBase_1.CrawlerProviderStorageBase {
    constructor(storageType, ctx) {
        super();
        this.ctx = ctx;
        this.storage = gitHubStorage;
    }
    startCrawlers() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CrawlerProviderStorage = CrawlerProviderStorage;
