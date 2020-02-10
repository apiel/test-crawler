import { LocalStorage } from './storage/LocalStorage';
import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';
import { crawl } from './crawl';
import { WsContext, Context } from 'isomor-server';

const gitHubStorage = new GitHubStorage();
const localStorage = new LocalStorage();

export abstract class CrawlerProviderStorage {
    storage: GitHubStorage | LocalStorage;

    constructor(storageType: StorageType, public ctx?: undefined | WsContext | Context ) {
        if (storageType === StorageType.Local) {
            this.storage = localStorage;
        } else if (storageType === StorageType.GitHub) {
            this.storage = gitHubStorage;
        } else {
            throw new Error(`Unknown storage type ${storageType}.`)
        }
    }

    async startCrawlers() {
        // for the moment this would only start locally
        // we will have to make a specific one to start remotely
        crawl(undefined, 30, (this.ctx as any)?.push);
    }
}
