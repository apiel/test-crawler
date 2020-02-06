import { Project, RemoteType } from '../typing';
import { LocalRemote } from './remote/LocalRemote';
import { GitHubRemote } from './remote/GitHubRemote';

const local = new LocalRemote();

export abstract class CrawlerProviderBase {
    abstract loadProject(projectId: string): Promise<Project>;

    protected async getRemote(projectId: string) {
        const { remote } = await this.loadProject(projectId);
        if (remote) {
            if (remote.type === RemoteType.GitHub) {
                return new GitHubRemote(remote);
            }
        }
        return local; // we should watch out cause it might be possible to set a none existing rmeote
    }

    protected async read(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.read(projectId, path);
    }

    protected async readLocal(projectId: string, path: string) {
        return local.read(projectId, path);
    }

    protected async readJSON(projectId: string, path: string) {
        const remote = await this.getRemote(projectId);
        return remote.readJSON(projectId, path);
    }

    protected async readJSONLocal(projectId: string, path: string) {
        return local.readJSON(projectId, path);
    }
}
