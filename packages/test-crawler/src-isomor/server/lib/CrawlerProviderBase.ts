import { Project, RemoteType } from '../typing';
import { LocalRemote } from './remote/LocalRemote';
import { GitHubRemote } from './remote/GitHubRemote';

export const LOCAL = true;

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

    protected async readdir(projectId: string, path: string, local = false) {
        if (local) {
            return this.getLocal(projectId).readdir(path);
        }
        const remote = await this.getRemote(projectId);
        return remote.readdir(path);
    }

    protected async read(projectId: string, path: string, local = false) {
        if (local) {
            return this.getLocal(projectId).read(path);
        }
        const remote = await this.getRemote(projectId);
        return remote.read(path);
    }

    protected async readJSON(projectId: string, path: string, local = false) {
        if (local) {
            return this.getLocal(projectId).readJSON(path);
        }
        const remote = await this.getRemote(projectId);
        return remote.readJSON(path);
    }

    protected async saveJSON(projectId: string, file: string, content: any, local = false) {
        if (local) {
            return this.getLocal(projectId).saveJSON(file, content);
        }
        const remote = await this.getRemote(projectId);
        return remote.saveJSON(file, content);
    }

    protected async remove(projectId: string, file: string, local = false) {
        if (local) {
            return this.getLocal(projectId).remove(file);
        }
        const remote = await this.getRemote(projectId);
        return remote.remove(file);
    }

    protected async copy(projectId: string, src: string, dst: string, local = false) {
        if (local) {
            return this.getLocal(projectId).copy(src, dst);
        }
        const remote = await this.getRemote(projectId);
        return remote.copy(src, dst);
    }
}
