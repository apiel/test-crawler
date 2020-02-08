import { Storage } from './Storage';

import { basename, dirname } from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import { CrawlTarget } from '../../typing';
import { config, GitHubConfig } from '../config';
import { ERR } from '../../error';

const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';

export class GitHubStorage extends Storage {
    private config: GitHubConfig | undefined;
    constructor() {
        super();
        this.config = config.remote.github;
    }

    async readdir(path: string) {
        const { data } = await this.getContents(path);
        return data.map(({ name }: any) => name) as string[]; // type is also available so we could filter for type === 'file'
    }

    async blob(path: string) {
        const { data } = await this.getContents(dirname(path));
        const filename = basename(path);
        const filedata = data.find((item: any) => item.name === filename);
        if (!filedata) {
            return;
        }
        const { data: { content } } = await this.call({
            url: `${this.blobUrl}/${filedata.sha}`,
        });
        return Buffer.from(content, 'base64');
    }

    async read(path: string) {
        const { data: { content } } = await this.getContents(path);
        return Buffer.from(content, 'base64');
    }

    async readJSON(path: string) {
        try {
            return JSON.parse((await this.read(path)).toString());
        } catch (error) {
            return undefined;
        }
    }

    async remove(file: string) {
        const { data: { sha } } = await this.getContents(file);
        const data = JSON.stringify({
            message: `${COMMIT_PREFIX} save json`,
            sha,
        });
        await this.call({
            method: 'DELETE',
            url: `${this.contentsUrl}/${file}`,
            data,
        });
    }

    async saveFile(file: string, content: string) {
        const { data: { sha } } = await this.getContents(file);
        const data = JSON.stringify({
            message: `${COMMIT_PREFIX} save json`,
            content: Buffer.from(content).toString('base64'),
            sha,
        });
        await this.call({
            method: 'PUT',
            url: `${this.contentsUrl}/${file}`,
            data,
        });
    }

    async saveJSON(file: string, content: any) {
        return this.saveFile(file, JSON.stringify(content, null, 4))
    }

    async copy(src: string, dst: string) {
        const srcData = await this.read(src);
        if (srcData) {
            this.saveFile(dst, srcData.toString());
        }
    }

    async crawl(crawlTarget?: CrawlTarget, consumeTimeout?: number, push?: (payload: any) => void) {
        throw new Error('To be implemented');
    }

    protected call(config: AxiosRequestConfig) {
        if (!this.config) {
            throw new Error(ERR.missingGitHubConfig);
        }
        return axios({
            ...config,
            headers: { ...config?.headers, 'Authorization': `token ${this.config.token}` },
        });
    }

    protected getContents(path: string) {
        return this.call({
            url: `${this.contentsUrl}/${path}`,
        });
    }

    protected get contentsUrl() {
        return `${BASE_URL}/repos/${this.config?.user}/${this.config?.repo}/contents`;
    }

    protected get blobUrl() {
        return `${BASE_URL}/repos/${this.config?.user}/${this.config?.repo}/git/blobs`;
    }

    // protected get repoUrl() {
    //     return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/${PROJECT_FOLDER}`;
    // }
}
