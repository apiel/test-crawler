import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';

const gitHubStorage = new GitHubStorage();

export abstract class CrawlerProviderStorage {
    protected getStorage(storageType: StorageType) {
        if (storageType === StorageType.GitHub) {
            return gitHubStorage;
        }
        throw new Error(`Unknown storage type ${storageType}.`)
    }
}
