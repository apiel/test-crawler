import { RemoteType } from '../typing';
import { LocalRemote } from './remote/LocalRemote';
import { GitHubRemote } from './remote/GitHubRemote';
import { PROJECT_FOLDER } from './config';
import { join } from 'path';

export const LOCAL = true;

const gitHubRemote = new GitHubRemote();
const localRemote = new LocalRemote();

export abstract class CrawlerProviderBase {
    protected getRemote(remoteType: RemoteType) {
        if (remoteType === RemoteType.Local) {
            return localRemote;
        } else if (remoteType === RemoteType.GitHub) {
            return gitHubRemote;
        }
        throw new Error(`Unknown remote type ${remoteType}.`)
    }

    protected join(projectId: string, ...path: string[]) {
        return join(PROJECT_FOLDER, projectId, ...path);
    }

    protected readdir(remoteType: RemoteType, path: string) {
        const remote = this.getRemote(remoteType);
        return remote.readdir(path);
    }

    protected read(remoteType: RemoteType, path: string) {
        const remote = this.getRemote(remoteType);
        return remote.read(path);
    }

    protected blob(remoteType: RemoteType, path: string) {
        const remote = this.getRemote(remoteType);
        return remote.blob(path);
    }

    protected readJSON(remoteType: RemoteType, path: string) {
        const remote = this.getRemote(remoteType);
        return remote.readJSON(path);
    }

    protected saveFile(remoteType: RemoteType, file: string, content: string) {
        const remote = this.getRemote(remoteType);
        return remote.saveFile(file, content);
    }

    protected saveJSON(remoteType: RemoteType, file: string, content: any) {
        const remote = this.getRemote(remoteType);
        return remote.saveJSON(file, content);
    }

    protected remove(remoteType: RemoteType, file: string) {
        const remote = this.getRemote(remoteType);
        return remote.remove(file);
    }

    protected copy(remoteType: RemoteType, src: string, dst: string) {
        const remote = this.getRemote(remoteType);
        return remote.copy(src, dst);
    }

    protected crawl(
        remoteType: RemoteType,
        projectId: string,
        pagesFolder: string,
        consumeTimeout?: number,
        push?: (payload: any) => void,
    ) {
        const crawlTarget = { projectId, pagesFolder };
        const remote = this.getRemote(remoteType);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
