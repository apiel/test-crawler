import { Storage } from './Storage';

import { basename, dirname } from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import { CrawlTarget } from '../../typing';
import { config, GitHubConfig } from '../config';
import { ERR } from '../../error';

const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';

// need to keep yml config in here to be able to compile it in static mode
const CI_Workflow = `
name: Test-crawler CI

on: [repository_dispatch]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup node
      uses: actions/setup-node@v1
    - name: Run test-crawler \${{ github.event.client_payload.projectId }}
      run: |
        ROOT_FOLDER=\`pwd\` npx -p test-crawler test-crawler-cli --project \${{ github.event.client_payload.projectId }}
    - name: Commit changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "Test-crawler"
        git add .
        git status
        git commit -m "[test-crawler] CI save" || echo "No changes to commit"
        git pull
        git push "https://\${{ secrets.GITHUB_TOKEN }}@github.com/\${{ github.repository }}"
`;

export class GitHubStorage extends Storage {
    private config: GitHubConfig | undefined;
    constructor() {
        super();
        this.config = config.remote.github;
    }

    async readdir(path: string) {
        try {
            const { data } = await this.getContents(path);
            return data.map(({ name }: any) => name) as string[]; // type is also available so we could filter for type === 'file'   
        } catch (error) {
            if (error.response.status === 404) {
                return [] as string[];
            }
            throw error;
        }
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
        const sha = await this.getSha(file);
        const data = JSON.stringify({
            message: `${COMMIT_PREFIX} save file`,
            content: Buffer.from(content).toString('base64'),
            ...(sha && { sha }),
        });
        await this.call({
            method: 'PUT',
            url: `${this.contentsUrl}/${file}`,
            data,
        });
    }

    protected async getSha(file: string) {
        try {
            const { data } = await this.getContents(file);
            if (data?.sha) {
                return data.sha;
            }
        } catch (error) {
            if (error.response.status !== 404) {
                throw error;
            }
        }
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
        if (crawlTarget?.projectId) { // run only if projectId provided (but we could think to do it also id)
            await this.saveFile('.github/workflows/test-crawler.yml', CI_Workflow);
            await this.call({
                method: 'POST',
                url: `${this.ciDispatchUrl}`,
                data: {
                    event_type: "test-crawler", // just to name the event, it has no impact on the action
                    client_payload: {
                        projectId: crawlTarget.projectId,
                    }
                },
            });
        }
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

    protected get ciDispatchUrl() {
        return `${BASE_URL}/repos/${this.config?.user}/${this.config?.repo}/dispatches`;
    }
}
