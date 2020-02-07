import { Remote } from './Remote';
import {
    readJSON,
    readFile,
    readdir,
    mkdirp,
    outputJSON,
    copy,
    pathExists,
    remove,
    outputFile,
} from 'fs-extra';
import { join } from 'path';
import { PROJECT_FOLDER } from '../config';
import { CrawlTarget } from '../../typing';
import { crawl } from '../crawl';

export class LocalRemote extends Remote {
    constructor(private projectId: string) {
        super();
    }

    async readdir(path: string) {
        const fullpath = this.getPath(path);
        if (await pathExists(fullpath)) {
            await mkdirp(fullpath);
            return readdir(fullpath);
        }
        return [] as string[];
    }

    async read(path: string) {
        const fullpath = this.getPath(path);
        if (await pathExists(fullpath)) {
            return readFile(fullpath);
        }
    }

    async readJSON(path: string) {
        const fullpath = this.getPath(path);
        if (await pathExists(fullpath)) {
            return readJSON(fullpath);
        }
    }

    saveJSON(file: string, data: any) {
        return outputJSON(this.getPath(file), data, { spaces: 4 });
    }

    saveFile(file: string, data: string) {
        return outputFile(this.getPath(file), data);
    }

    async copy(src: string, dst: string) {
        const srcFile = this.getPath(src);
        if (await pathExists(srcFile)) {
            return copy(srcFile, this.getPath(dst), { overwrite: true });
        }
    }

    remove(file: string) {
        return remove(this.getPath(file));
    }

    crawl(crawlTarget?: CrawlTarget, consumeTimeout?: number, push?: (payload: any) => void) {
        return crawl(crawlTarget, consumeTimeout, push);
    }

    protected getPath(path: string) {
        return join(PROJECT_FOLDER, this.projectId, path);
    }
}
