import { PROJECT_FOLDER } from './config';
import { join } from 'path';
import { CrawlerProviderStorage } from './CrawlerProviderStorage';
import { StorageType } from '../storage.typing';

export abstract class CrawlerProviderBase extends CrawlerProviderStorage {
    repos(storageType: StorageType) {
        const remote = this.getStorage(storageType);
        return remote.repos();
    }

    repo(storageType: StorageType) {
        const remote = this.getStorage(storageType);
        return remote.repo();
    }

    info(storageType: StorageType) {
        const remote = this.getStorage(storageType);
        return remote.info();
    }

    protected join(projectId: string, ...path: string[]) {
        return join(PROJECT_FOLDER, projectId, ...path);
    }

    protected readdir(storageType: StorageType, path: string) {
        const remote = this.getStorage(storageType);
        return remote.readdir(path);
    }

    protected read(storageType: StorageType, path: string) {
        const remote = this.getStorage(storageType);
        return remote.read(path);
    }

    protected blob(storageType: StorageType, path: string) {
        const remote = this.getStorage(storageType);
        return remote.blob(path);
    }

    protected readJSON(storageType: StorageType, path: string) {
        const remote = this.getStorage(storageType);
        return remote.readJSON(path);
    }

    protected saveFile(storageType: StorageType, file: string, content: string) {
        const remote = this.getStorage(storageType);
        return remote.saveFile(file, content);
    }

    protected saveJSON(storageType: StorageType, file: string, content: any) {
        const remote = this.getStorage(storageType);
        return remote.saveJSON(file, content);
    }

    protected remove(storageType: StorageType, file: string) {
        const remote = this.getStorage(storageType);
        return remote.remove(file);
    }

    protected copy(storageType: StorageType, src: string, dst: string) {
        const remote = this.getStorage(storageType);
        return remote.copy(src, dst);
    }

    protected crawl(
        storageType: StorageType,
        projectId: string,
        pagesFolder: string,
        consumeTimeout?: number,
        push?: (payload: any) => void,
    ) {
        const crawlTarget = { projectId, pagesFolder };
        const remote = this.getStorage(storageType);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
