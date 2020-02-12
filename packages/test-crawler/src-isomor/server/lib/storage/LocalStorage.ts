import { WsContext, Context } from 'isomor-server';

import { Storage } from './Storage';
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
import { CrawlTarget, Job } from '../../typing';
import { crawl } from '../crawl';
import { join } from 'path';
import { ROOT_FOLDER } from '../config';

export class LocalStorage extends Storage {
    constructor(protected ctx?: undefined | WsContext | Context) {
        super();
    }

    async readdir(path: string) {
        if (await pathExists(this.root(path))) {
            await mkdirp(this.root(path));
            return readdir(this.root(path));
        }
        return [] as string[];
    }

    async read(path: string) {
        if (await pathExists(this.root(path))) {
            return readFile(this.root(path));
        }
    }

    async readJSON(path: string) {
        if (await pathExists(this.root(path))) {
            return readJSON(this.root(path));
        }
    }

    blob(path: string) {
        return this.read(path);
    }

    saveJSON(file: string, data: any) {
        return outputJSON(this.root(file), data, { spaces: 4 });
    }

    saveFile(file: string, data: string) {
        return outputFile(this.root(file), data);
    }

    async copy(src: string, dst: string) {
        if (await pathExists(this.root(src))) {
            return copy(this.root(src), this.root(dst), { overwrite: true });
        }
    }

    remove(file: string) {
        return remove(this.root(file));
    }

    async crawl(crawlTarget?: CrawlTarget, consumeTimeout?: number, push?: (payload: any) => void) {
        await crawl(crawlTarget, consumeTimeout, push);
        return undefined;
    }

    root(...path: string[]) {
        return join(ROOT_FOLDER, ...path);
    }

    async repos() {
        return undefined;
    }

    async getRepo() {
        return undefined;
    }

    async info() {
        return undefined;
    }

    async jobs() {
        return [] as Job[];
    }
}
