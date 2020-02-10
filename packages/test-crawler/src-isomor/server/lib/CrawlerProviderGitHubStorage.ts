import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';

const gitHubStorage = new GitHubStorage();

export abstract class CrawlerProviderStorage {
    constructor(storageType: StorageType) {}

    storage = gitHubStorage;

    async startCrawlers(push?: (payload: any) => void) {}
}
