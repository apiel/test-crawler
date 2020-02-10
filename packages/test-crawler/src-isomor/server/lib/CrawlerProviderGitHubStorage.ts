import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';
import { WsContext, Context } from 'isomor-server';

const gitHubStorage = new GitHubStorage();

export abstract class CrawlerProviderStorage {
    constructor(storageType: StorageType, public ctx: undefined | WsContext | Context) {}

    storage = gitHubStorage;

    async startCrawlers() {}
}
