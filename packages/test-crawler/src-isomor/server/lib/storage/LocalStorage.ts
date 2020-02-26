import { WsContext, Context } from 'isomor-server';
import { CrawlTarget, Browser, ROOT_FOLDER } from 'test-crawler-core';
import { crawl, Push, setDefaultDriversDestination } from 'test-crawler-cli';
import { join } from 'path';

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
import { Job } from '../../typing';

setDefaultDriversDestination(
    join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin'),
);

export class LocalStorage extends Storage {
    constructor(protected ctx?: undefined | WsContext | Context) {
        super();
    }

    get browsers(): Browser[] {
        const browsers = [
            Browser.ChromeSelenium,
            Browser.FirefoxSelenium,
            Browser.ChromePuppeteer,
        ];
        if (process.platform == 'darwin') {
            browsers.push(Browser.SafariSelenium);
        } else if (process.platform == 'win32') {
            browsers.push(Browser.IeSelenium);
        }
        return browsers;
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

    image(path: string) {
        return this.read(path);
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

    copyBlob(src: string, dst: string) {
        return this.copy(src, dst);
    }

    remove(file: string) {
        return remove(this.root(file));
    }

    async crawl(crawlTarget?: CrawlTarget, push?: Push) {
        await crawl(crawlTarget, push);
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
