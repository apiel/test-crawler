import { Remote } from './Remote';

import axios, { AxiosRequestConfig } from 'axios';
import { join } from 'path';
import { RemoteGitHub } from '../../typing';

// https://developer.github.com/v3/repos/contents/#create-or-update-a-file
// https://api.github.com/repos/apiel/test-crawler-remote-folder/commits
// https://api.github.com/repos/apiel/test-crawler-remote-folder/contents/test-crawler/crawl
// https://api.github.com/repos/apiel/test-crawler-remote-folder/contents/yo.txt

const BASE_URL = 'https://api.github.com';
const FOLDER = 'test-crawler';

export class GitHubRemote extends Remote {
    constructor(private config: RemoteGitHub) {
        super();
    }

    async readdir(path: string) {
        const { data } = await this.getContents(path);
        return data.map(({ name }) => name); // type is also available so we could filter for type === 'file'
    }

    async read(path: string) {
        const { data: { content }} = await this.getContents(path);
        return Buffer.from(content, 'base64');
    }

    async readJSON(path: string) {
        return JSON.parse((await this.read(path)).toString());
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
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/contents/${FOLDER}`;
    }

    protected get repoUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/${FOLDER}`;
    }
}
