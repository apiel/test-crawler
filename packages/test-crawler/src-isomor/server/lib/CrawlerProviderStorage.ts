import { WsContext, Context } from 'isomor-server';
// import Cookies from 'universal-cookie';
const Cookies = require('universal-cookie');

import { LocalStorage } from './storage/LocalStorage';
import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';
import { crawl } from './crawl';
import { CrawlerProviderStorageBase } from './CrawlerProviderStorageBase';

export function getCookie(key: string, ctx?: undefined | WsContext | Context) {
    const cookies = new Cookies(ctx?.req?.headers.cookie);
    return cookies.get(key);
}

export abstract class CrawlerProviderStorage extends CrawlerProviderStorageBase {
    storage: GitHubStorage | LocalStorage;

    constructor(storageType?: StorageType, public ctx?: undefined | WsContext | Context) {
        super();
        if (storageType === StorageType.Local || storageType === undefined) {
            this.storage = new LocalStorage(ctx);
        } else if (storageType === StorageType.GitHub) {
            this.storage = new GitHubStorage(ctx);
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
