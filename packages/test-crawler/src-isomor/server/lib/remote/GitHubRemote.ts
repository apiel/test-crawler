import { Remote } from './Remote';

import axios, { AxiosRequestConfig } from 'axios';
import { CrawlTarget } from '../../typing';
import { config, GitHubConfig } from '../config';

// https://developer.github.com/v3/repos/contents/#create-or-update-a-file
// https://api.github.com/repos/apiel/test-crawler-remote-folder/commits
// https://api.github.com/repos/apiel/test-crawler-remote-folder/contents/test-crawler/crawl
// https://api.github.com/repos/apiel/test-crawler-remote-folder/contents/yo.txt

const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';

export class GitHubRemote extends Remote {
    private config: GitHubConfig;
    constructor() {
        super();
        if (!config.remote.github) {
            throw new Error('cannot use GitHub if no config provided');
        }
        this.config = config.remote.github;
    }

    async readdir(path: string) {
        const { data } = await this.getContents(path);
        return data.map(({ name }) => name) as string[]; // type is also available so we could filter for type === 'file'
    }

    async read(path: string) {
        const { data: { content } } = await this.getContents(path);
        return Buffer.from(content, 'base64');
    }

    async readJSON(path: string) {
        return JSON.parse((await this.read(path)).toString());
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
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/contents`;
    }

    // protected get repoUrl() {
    //     return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/${PROJECT_FOLDER}`;
    // }
}
