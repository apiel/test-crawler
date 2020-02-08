import { LocalStorage } from './storage/LocalStorage';
import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';

const gitHubStorage = new GitHubStorage();
const localStorage = new LocalStorage();

export abstract class CrawlerProviderStorage {
    protected getStorage(storageType: StorageType) {
        if (storageType === StorageType.Local) {
            return localStorage;
        } else if (storageType === StorageType.GitHub) {
            return gitHubStorage;
        }
        throw new Error(`Unknown storage type ${storageType}.`)
    }
}
