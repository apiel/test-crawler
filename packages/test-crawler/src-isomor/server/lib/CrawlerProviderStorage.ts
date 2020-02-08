import { LocalStorage } from './storage/LocalStorage';
import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';
import { crawl } from './crawl';

const gitHubStorage = new GitHubStorage();
const localStorage = new LocalStorage();

export abstract class CrawlerProviderStorage {
    async startCrawlers(push?: (payload: any) => void) {
        // for the moment this would only start locally
        // we will have to make a specific one to start remotely
        crawl(undefined, 30, push);
    }
    
    protected getStorage(storageType: StorageType) {
        if (storageType === StorageType.Local) {
            return localStorage;
        } else if (storageType === StorageType.GitHub) {
            return gitHubStorage;
        }
        throw new Error(`Unknown storage type ${storageType}.`)
    }
}
