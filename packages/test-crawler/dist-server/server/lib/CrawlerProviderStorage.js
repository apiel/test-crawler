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
const test_crawler_cli_1 = require("test-crawler-cli");
const Cookies = require('universal-cookie');
const LocalStorage_1 = require("./storage/LocalStorage");
const GitHubStorage_1 = require("./storage/GitHubStorage");
const storage_typing_1 = require("../storage.typing");
const CrawlerProviderStorageBase_1 = require("./CrawlerProviderStorageBase");
function getCookie(key, ctx) {
    var _a;
    const cookies = new Cookies((_a = ctx === null || ctx === void 0 ? void 0 : ctx.req) === null || _a === void 0 ? void 0 : _a.headers.cookie);
    return cookies.get(key);
}
exports.getCookie = getCookie;
class CrawlerProviderStorage extends CrawlerProviderStorageBase_1.CrawlerProviderStorageBase {
    constructor(storageType, ctx) {
        super();
        this.ctx = ctx;
        if (storageType === storage_typing_1.StorageType.Local || storageType === undefined) {
            this.storage = new LocalStorage_1.LocalStorage(ctx);
        }
        else if (storageType === storage_typing_1.StorageType.GitHub) {
            this.storage = new GitHubStorage_1.GitHubStorage(ctx);
        }
        else {
            throw new Error(`Unknown storage type ${storageType}.`);
        }
    }
    startCrawlers() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            test_crawler_cli_1.crawl(undefined, (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.push);
        });
    }
}
exports.CrawlerProviderStorage = CrawlerProviderStorage;
