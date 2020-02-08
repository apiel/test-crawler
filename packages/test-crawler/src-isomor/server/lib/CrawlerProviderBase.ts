import { Project, RemoteType, CrawlTarget } from '../typing';
import { LocalRemote } from './remote/LocalRemote';
import { GitHubRemote } from './remote/GitHubRemote';

export const LOCAL = true;

export abstract class CrawlerProviderBase {
    abstract loadProject(projectId: string): Promise<Project>;

    protected async getRemote(projectId: string, forceLocal: boolean) {
        if (!forceLocal) {
            const { remote } = await this.loadProject(projectId);
            if (remote) {
                if (remote.type === RemoteType.GitHub) {
                    return new GitHubRemote(remote);
                }
            }
        }
        return new LocalRemote(projectId); // we should watch out cause it might be possible to set a none existing rmeote
    }

    protected async readdir(projectId: string, path: string, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.readdir(path);
    }

    protected async read(projectId: string, path: string, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.read(path);
    }

    protected async readJSON(projectId: string, path: string, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.readJSON(path);
    }

    protected async saveFile(projectId: string, file: string, content: string, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.saveFile(file, content);
    }

    protected async saveJSON(projectId: string, file: string, content: any, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.saveJSON(file, content);
    }

    protected async remove(projectId: string, file: string, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.remove(file);
    }

    protected async copy(projectId: string, src: string, dst: string, forceLocal = false) {
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.copy(src, dst);
    }

    protected async crawl(
        projectId: string,
        pagesFolder: string,
        consumeTimeout?: number,
        push?: (payload: any) => void,
        forceLocal = false,
    ) {
        const crawlTarget = { projectId, pagesFolder };
        const remote = await this.getRemote(projectId, forceLocal);
        return remote.crawl(crawlTarget, consumeTimeout, push);
    }
}
