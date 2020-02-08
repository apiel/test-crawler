"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorage_1 = require("./storage/LocalStorage");
const GitHubStorage_1 = require("./storage/GitHubStorage");
const storage_typing_1 = require("../storage.typing");
const gitHubStorage = new GitHubStorage_1.GitHubStorage();
const localStorage = new LocalStorage_1.LocalStorage();
class CrawlerProviderStorage {
    getStorage(storageType) {
        if (storageType === storage_typing_1.StorageType.Local) {
            return localStorage;
        }
        else if (storageType === storage_typing_1.StorageType.GitHub) {
            return gitHubStorage;
        }
        throw new Error(`Unknown storage type ${storageType}.`);
    }
}
exports.CrawlerProviderStorage = CrawlerProviderStorage;
