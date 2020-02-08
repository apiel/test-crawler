import { StorageType } from '../typing';
import { LocalRemote } from './remote/LocalRemote';
import { GitHubRemote } from './remote/GitHubRemote';
import { PROJECT_FOLDER } from './config';
import { join } from 'path';

export const LOCAL = true;

const gitHubRemote = new GitHubRemote();
const localRemote = new LocalRemote();

export abstract class CrawlerProviderBase {
    protected getRemote(storageType: StorageType) {
        if (storageType === StorageType.Local) {
            return localRemote;
        } else if (storageType === StorageType.GitHub) {
            return gitHubRemote;
        }
        throw new Error(`Unknown remote type ${storageType}.`)
    }

    protected join(projectId: string, ...path: string[]) {
        return join(PROJECT_FOLDER, projectId, ...path);
    }

    protected readdir(storageType: StorageType, path: string) {
        const remote = this.getRemote(storageType);
        return remote.readdir(path);
    }

    protected read(storageType: StorageType, path: string) {
        const remote = this.getRemote(storageType);
        return remote.read(path);
    }

    protected blob(storageType: StorageType, path: string) {
        const remote = this.getRemote(storageType);
        return remote.blob(path);
    }

    protected readJSON(storageType: StorageType, path: string) {
        const remote = this.getRemote(storageType);
        return remote.readJSON(path);
    }

    protected saveFile(storageType: StorageType, file: string, content: string) {
        const remote = this.getRemote(storageType);
        return remote.saveFile(file, content);
    }

    protected saveJSON(storageType: StorageType, file: string, content: any) {
        const remote = this.getRemote(storageType);
        return remote.saveJSON(file, content);
    }

    protected remove(storageType: StorageType, file: string) {
        const remote = this.getRemote(storageType);
        return remote.remove(file);
    }

    protected copy(storageType: StorageType, src: string, dst: string) {
        const remote = this.getRemote(storageType);
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
        const remote = this.getRemote(storageType);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
