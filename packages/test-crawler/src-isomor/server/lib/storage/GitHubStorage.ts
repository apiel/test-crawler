import { Storage } from './Storage';

import { basename, dirname } from 'path';
import { WsContext, Context } from 'isomor-server';
import axios, { AxiosRequestConfig } from 'axios';
import { CrawlTarget, Job } from '../../typing';
import { config, GitHubConfig } from '../config';
import { ERR } from '../../error';
import { getCookie } from '../CrawlerProviderStorage';

const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[test-crawler]';
const EVENT_TYPE = 'test-crawler';

// need to keep yml config in here to be able to compile it in static mode
const CI_Workflow = `
name: Test-crawler CI

on:
  repository_dispatch:
    types: [${EVENT_TYPE}]

jobs:
  test-crawler:

    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v2
    - name: Enable safari driver
      run: |
        sudo safaridriver --enable
        safaridriver -p 0 &
    - name: Run test-crawler \${{ github.event.client_payload.projectId }}
      uses: apiel/test-crawler/actions/run@master
    - name: Push changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: \${{ secrets.GITHUB_TOKEN }}
`;

interface GitHubWorkflow {
    status: string;
    id: string;
    html_url: string;
    created_at: string;
    updated_at: string;
}

interface GitHubJob {
    status: string;
    html_url: string;
    started_at: string;
    steps: GitHubStep[];
}

interface GitHubStep {
    status: string;
    name: string;
    started_at: string;
}

export class GitHubStorage extends Storage {
    private config: GitHubConfig | undefined;
    constructor(protected ctx?: undefined | WsContext | Context) {
        super();
        this.config = config.remote.github;
    }

    async readdir(path: string) {
        try {
            const { data } = await this.getContents(path);
            return data.map(({ name }: any) => name) as string[]; // type is also available so we could filter for type === 'file'   
        } catch (error) {
            if (error?.response?.status === 404) {
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
        if (!this.repo) {
            throw new Error('GitHub repository required.');
        }
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
            if (error?.response?.status !== 404) {
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
                    event_type: EVENT_TYPE,
                    client_payload: {
                        projectId: crawlTarget.projectId,
                    }
                },
            });
        }
        return this.redirectUrl;
    }

    async repos() {
        const { data } = await this.call({
            url: `${BASE_URL}/users/${this.config?.user}/repos?sort=updated&per_page=1000`,
        });
        return data.map(({ name }: any) => name) as string[];
    }

    async getRepo() {
        return this.repo;
    }

    async info() {
        const { data: { rate: { limit, remaining } } } = await this.call({
            url: `${BASE_URL}/rate_limit`,
        });
        return `For GitHub API requests, you can make up to 5000 requests per hour.
        Every pages of the test-crawler UI is using multiples request at once. Your
        current rate limit is: ${remaining} of ${limit}`;
    }

    async jobs(projectId: string) {
        const { data: { workflow_runs } } = await this.call({
            url: this.runsUrl,
        });
        const inProgress = await this.getInProgressJobs(projectId, workflow_runs);
        const queued = this.getQueuedJobs(workflow_runs);

        return [...queued, ...inProgress];
    }

    protected getQueuedJobs(runs: GitHubWorkflow[]) {
        return runs.filter(({ status }) => !['in_progress', 'completed'].includes(status))
            .map(({ id, html_url, status, created_at, updated_at }) => ({
                id,
                url: html_url,
                status,
                startAt: Math.round(new Date(created_at).getTime() / 1000),
                lastUpdate: Math.round(new Date(updated_at).getTime() / 1000),
            })) as Job[];
    }

    protected async getInProgressJobs(projectId: string, runs: GitHubWorkflow[]) {
        const progressIds = runs.filter(({ status }) => status === 'in_progress').map(({ id }) => id);
        const jobs = progressIds.map(async (id: string) => {
            const { data: { jobs } } = await this.call({
                url: `${BASE_URL}/repos/${this.user}/${this.repo}/actions/runs/${id}/jobs`,
            });
            const [job]: [GitHubJob] = jobs;
            const isProjectJob = job.steps.find(({ name }) => name.includes(projectId)) !== undefined;
            if (isProjectJob) {
                const step = job.steps.find(({ status }) => status === 'in_progress');
                return {
                    id,
                    url: job.html_url,
                    status: job.status,
                    startAt: Math.round(new Date(job.started_at).getTime() / 1000),
                    stepsCount: job.steps.length,
                    stepsDone: job.steps.filter(({ status }) => status === 'completed').length,
                    currentStep: step?.name || 'unknown',
                    lastUpdate: Math.round(new Date(step?.started_at || job.started_at).getTime() / 1000),
                } as Job;
            }
        }) as Promise<Job | undefined>[];
        return (await Promise.all(jobs)).filter(job => job) as Job[];
    }

    protected call(config: AxiosRequestConfig) {
        if (!this.token || !this.user) {
            throw new Error(ERR.missingGitHubConfig);
        }
        return axios({
            ...config,
            headers: { ...config?.headers, 'Authorization': `token ${this.token}` },
        });
    }

    protected getContents(path: string) {
        return this.call({
            url: `${this.contentsUrl}/${path}`,
        });
    }

    protected get contentsUrl() {
        return `${BASE_URL}/repos/${this.user}/${this.repo}/contents`;
    }

    protected get blobUrl() {
        return `${BASE_URL}/repos/${this.user}/${this.repo}/git/blobs`;
    }

    protected get ciDispatchUrl() {
        return `${BASE_URL}/repos/${this.user}/${this.repo}/dispatches`;
    }

    protected get runsUrl() {
        return `${BASE_URL}/repos/${this.user}/${this.repo}/actions/workflows/test-crawler.yml/runs?event=repository_dispatch`;
    }

    protected get redirectUrl() {
        return `https://github.com/${this.user}/${this.repo}/actions`;
    }

    protected get user() {
        return getCookie('github', this.ctx)?.user || this.config?.user;
    }

    protected get token() {
        return getCookie('github', this.ctx)?.token || this.config?.user;
    }

    protected get repo() {
        return getCookie('githubRepo', this.ctx) || this.config?.defaultRepo;
    }
}
