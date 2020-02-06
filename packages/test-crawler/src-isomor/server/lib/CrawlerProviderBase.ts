import { Project, RemoteType } from '../typing';
import { LocalRemote } from './remote/LocalRemote';
import { GitHubRemote } from './remote/GitHubRemote';

export abstract class CrawlerProviderBase {
    abstract loadProject(projectId: string): Promise<Project>;

    protected async getRemote(projectId: string) {
        const { remote } = await this.loadProject(projectId);
        if (remote) {
            if (remote.type === RemoteType.GitHub) {
                return new GitHubRemote(remote);
            }
        }
        return this.getLocal(projectId); // we should watch out cause it might be possible to set a none existing rmeote
    }

    protected getLocal(projectId: string) {
        return new LocalRemote(projectId);
    }

    protected async readdir(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.readdir(path);
    }

    protected async readdirLocal(projectId: string, path: string) {
        return this.getLocal(projectId).readdir(path);
    }

    protected async read(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.read(path);
    }

    protected async readLocal(projectId: string, path: string) {
        return this.getLocal(projectId).read(path);
    }

    protected async readJSON(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.readJSON(path);
    }

    protected async readJSONLocal(projectId: string, path: string) {
        return this.getLocal(projectId).readJSON(path);
    }
}
