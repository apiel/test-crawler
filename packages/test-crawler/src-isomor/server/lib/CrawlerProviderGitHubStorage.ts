import { WsContext, Context } from 'isomor-server';
import Cookies from 'universal-cookie';
import { GitHubStorage } from './storage/GitHubStorage';
import { StorageType } from '../storage.typing';
import { CrawlerProviderStorageBase } from './CrawlerProviderStorageBase';


const gitHubStorage = new GitHubStorage();

export function getCookie(key: string, ctx?: undefined | WsContext | Context) {
    const cookies = new Cookies();
    return cookies.get(key);
}

export abstract class CrawlerProviderStorage extends CrawlerProviderStorageBase {
    constructor(storageType: StorageType, public ctx: undefined | WsContext | Context) {
        super();
    }

    storage = gitHubStorage;

    async startCrawlers() {}
}
