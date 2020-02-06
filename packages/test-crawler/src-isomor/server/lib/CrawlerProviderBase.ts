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

    protected readdirLocal(projectId: string, path: string) {
        return this.getLocal(projectId).readdir(path);
    }

    protected async read(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.read(path);
    }

    protected readLocal(projectId: string, path: string) {
        return this.getLocal(projectId).read(path);
    }

    protected async readJSON(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.readJSON(path);
    }

    protected readJSONLocal(projectId: string, path: string) {
        return this.getLocal(projectId).readJSON(path);
    }

    protected async saveJSON(projectId: string, file: string, content: any) {
        const remote = await this.getRemote(projectId);
        return remote.saveJSON(file, content);
    }

    protected saveJSONLocal(projectId: string, file: string, content: any) {
        return this.getLocal(projectId).saveJSON(file, content);
    }

    protected async copy(projectId: string, src: string, dst: string) {
        const remote = await this.getRemote(projectId);
        return remote.copy(src, dst);
    }

    protected copyLocal(projectId: string, src: string, dst: string) {
        return this.getLocal(projectId).copy(src, dst);
    }
}
