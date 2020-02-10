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
const LocalStorage_1 = require("./storage/LocalStorage");
const GitHubStorage_1 = require("./storage/GitHubStorage");
const storage_typing_1 = require("../storage.typing");
const crawl_1 = require("./crawl");
const gitHubStorage = new GitHubStorage_1.GitHubStorage();
const localStorage = new LocalStorage_1.LocalStorage();
class CrawlerProviderStorage {
    constructor(storageType) {
        if (storageType === storage_typing_1.StorageType.Local) {
            this.storage = localStorage;
        }
        else if (storageType === storage_typing_1.StorageType.GitHub) {
            this.storage = gitHubStorage;
        }
        else {
            throw new Error(`Unknown storage type ${storageType}.`);
        }
    }
    startCrawlers(push) {
        return __awaiter(this, void 0, void 0, function* () {
            crawl_1.crawl(undefined, 30, push);
        });
    }
}
exports.CrawlerProviderStorage = CrawlerProviderStorage;
