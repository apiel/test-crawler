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

    async read(projectId: string, path: string) {
        const response = await this.call({
            url: `${this.contentsUrl}/${path}`,
        });
        return Buffer.from(response.data.content, 'base64');
    }

    async readJSON(projectId: string, path: string) {
        return JSON.parse((await this.read(projectId, path)).toString());
    }

    protected call(config: AxiosRequestConfig) {
        return axios({
            ...config,
            headers: { ...config?.headers, 'Authorization': `token ${this.config.token}` },
        });
    }

    protected get contentsUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/contents/${FOLDER}`;
    }

    protected get repoUrl() {
        return `${BASE_URL}/repos/${this.config.user}/${this.config.repo}/${FOLDER}`;
    }
}
