import { LocalStorage } from './storage/LocalStorage';
import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';
import { crawl } from './crawl';

const gitHubStorage = new GitHubStorage();
const localStorage = new LocalStorage();

export abstract class CrawlerProviderStorage {
    storage: GitHubStorage | LocalStorage;

    constructor(storageType: StorageType) {
        if (storageType === StorageType.Local) {
            this.storage = localStorage;
        } else if (storageType === StorageType.GitHub) {
            this.storage = gitHubStorage;
        } else {
            throw new Error(`Unknown storage type ${storageType}.`)
        }
    }

    async startCrawlers(push?: (payload: any) => void) {
        // for the moment this would only start locally
        // we will have to make a specific one to start remotely
        crawl(undefined, 30, push);
    }
}
