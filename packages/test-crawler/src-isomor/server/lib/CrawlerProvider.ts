import {
    readdir,
    readJSON,
    outputJSON,
    outputFile,
    readFile,
    pathExists,
    copy,
    remove,
    readJson,
    mkdirp,
} from 'fs-extra';
import { join, extname } from 'path';
import * as rimraf from 'rimraf';
import * as md5 from 'md5';
import axios from 'axios';
import { exec } from 'child_process';
import { groupOverlappingZone } from 'pixdiff-zone';

import { CRAWL_FOLDER, MAX_HISTORY, PIN_FOLDER, PROJECT_FOLDER, CODE_FOLDER } from './config';
import { getFolders, addToQueue, getFilePath, FilePath, getCodeList } from './utils';

import { Crawler, CrawlerInput, StartCrawler, PageData, Project, Code, CodeInfoList } from '../typing';
import { crawl } from './crawl';
import { CrawlerMethod } from '.';
import { CrawlerLocalProvider } from './CrawlerLocalProvider';
import { CrawlerGitProvider } from './CrawlerGitProvider';

const crawlerLocalProvider = new CrawlerLocalProvider();
const crawlerGitProvider = new CrawlerGitProvider();

export class CrawlerProvider {
    getSettings() {
        return {
            dir: __dirname,
        };
    }

    async getCrawler(projectId: string, timestamp: string): Promise<Crawler> {
        const { git } = await this.loadProject(projectId);
        if (git) {
            return crawlerGitProvider.getCrawler(git, timestamp);
        }
        return crawlerLocalProvider.getCrawler(projectId, timestamp);
    }

    async getAllCrawlers(projectId: string): Promise<Crawler[]> {
        const { git } = await this.loadProject(projectId);
        if (git) {
            return crawlerGitProvider.getAllCrawlers(git);
        }
        return crawlerLocalProvider.getAllCrawlers(projectId);
    }

    async setZoneStatus(projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData> {
        const folder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const data: PageData = await readJson(filePath('json'));
        if (status === 'pin') {
            const basePath = getFilePath(id, join(PROJECT_FOLDER, projectId, PIN_FOLDER));
            const base: PageData = await readJson(basePath('json'));

            base.png.diff.zones.push({ ...data.png.diff.zones[index], status });
            const zones = base.png.diff.zones.map(item => item.zone);
            zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
            const groupedZones = groupOverlappingZone(zones);
            base.png.diff.zones = groupedZones.map(zone => ({ zone, status }));

            await outputJSON(basePath('json'), base, { spaces: 4 });
        }
        data.png.diff.zones[index].status = status;
        await outputJSON(filePath('json'), data, { spaces: 4 });
        return data;
    }

    async setZonesStatus(projectId: string, timestamp: string, id: string, status: string): Promise<PageData> {
        const folder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const page: PageData = await readJson(filePath('json'));
        let newPage: PageData;
        for (let index = 0; index < page.png.diff.zones.length; index++) {
            newPage = await this.setZoneStatus(projectId, timestamp, id, index, status);
        }
        return newPage;
    }

    private async copyFile(filePath: FilePath, basePath: FilePath, extension: string) {
        const file = filePath(extension);
        if (await pathExists(file)) {
            await copy(file, basePath(extension), { overwrite: true });
        }
    }

    async copyToPins(projectId: string, timestamp: string, id: string): Promise<PageData> {
        const pinFolder = join(PROJECT_FOLDER, projectId, PIN_FOLDER);
        await mkdirp(pinFolder);
        const folder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const basePath = getFilePath(id, pinFolder);

        const data: PageData = await readJson(filePath('json'));
        data.png.diff = {
            pixelDiffRatio: 0,
            zones: [],
        };
        await outputJSON(filePath('json'), data, { spaces: 4 });

        await this.copyFile(filePath, basePath, 'png');
        await this.copyFile(filePath, basePath, 'html');
        await this.copyFile(filePath, basePath, 'json');

        return data;
    }

    private async removeFile(filePath: FilePath, extension: string) {
        const file = filePath(extension);
        if (await pathExists(file)) {
            await remove(file);
        }
    }

    async removeFromPins(projectId: string, id: string): Promise<PageData[]> {
        const pinFolder = join(PROJECT_FOLDER, projectId, PIN_FOLDER);

        const filePath = getFilePath(id, pinFolder);

        await this.removeFile(filePath, 'png');
        await this.removeFile(filePath, 'html');
        await this.removeFile(filePath, 'json');

        return this.getPins(projectId);
    }

    image(projectId: string, folder: string, id: string): Promise<Buffer> {
        const target = folder === 'base' ?
            join(PROJECT_FOLDER, projectId, PIN_FOLDER)
            : join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, folder);
        const filePath = getFilePath(id, target);
        return readFile(filePath('png'));
    }

    async saveCode(projectId: string, code: Code): Promise<void> {
        const { source, ...codeInfo } = code;
        const list = await this.getCodeList(projectId);
        list[code.id] = codeInfo;
        outputJSON(join(PROJECT_FOLDER, projectId, CODE_FOLDER, `list.json`), { ...list }, { spaces: 4 }); // for some reason it need a copy
        outputFile(join(PROJECT_FOLDER, projectId, CODE_FOLDER, `${code.id}.js`), source);
    }

    async loadCode(projectId: string, id: string): Promise<Code> {
        const list = await this.getCodeList(projectId);
        const codeInfo = list[id];
        const sourcePath = join(PROJECT_FOLDER, projectId, CODE_FOLDER, `${id}.js`);
        if (!codeInfo || !(await pathExists(sourcePath))) {
            return {
                id,
                name: '',
                pattern: '',
                source: '',
            };
        }
        const source = (await readFile(sourcePath)).toString();
        return { ...codeInfo, source };
    }

    async getCodeList(projectId: string): Promise<CodeInfoList> {
        return getCodeList(projectId);
    }

    getPins(projectId: string): Promise<PageData[]> {
        const folder = join(PROJECT_FOLDER, projectId, PIN_FOLDER);
        return this.getPinsInFolder(folder);
    }

    getPin(projectId: string, id: string): Promise<PageData> {
        const folder = join(PROJECT_FOLDER, projectId, PIN_FOLDER);
        return this.getPageInFolder(folder, id);
    }

    getPages(projectId: string, timestamp: string): Promise<PageData[]> {
        const folder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp);
        return this.getPinsInFolder(folder);
    }

    private getPageInFolder(folder: string, id: string): Promise<PageData> {
        const filePath = getFilePath(id, folder);
        return readJSON(filePath('json'));
    }

    private async getPinsInFolder(folder: string): Promise<PageData[]> {
        await mkdirp(folder);
        const files = await readdir(folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json' && file !== '_.json')
                .map(file => readJSON(join(folder, file))),
        );
    }

    async setCrawlerStatus(projectId: string, timestamp: string, status: string): Promise<Crawler> {
        const file = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, '_.json');
        const crawler: Crawler = await readJson(file);
        crawler.status = status;
        await outputJSON(file, crawler, { spaces: 4 });
        return crawler;
    }

    async loadProjects(): Promise<Project[]> {
        await mkdirp(PROJECT_FOLDER);
        const projects = await readdir(PROJECT_FOLDER);
        return Promise.all(
            projects.map(projectId => this.loadProject(projectId)),
        );
    }

    loadProject(projectId: string): Promise<Project> {
        return readJSON(join(PROJECT_FOLDER, projectId, `project.json`));
    }

    async saveProject(crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
        if (!projectId) {
            projectId = md5(name);
        }
        const file = join(PROJECT_FOLDER, projectId, `project.json`);
        console.log('file', file);
        const project = { id: projectId, name, crawlerInput };
        await outputJSON(file, project, { spaces: 4 });
        return project;
    }

    async startCrawlerFromProject(projectId: string, push?: (payload: any) => void): Promise<StartCrawler> {
        const project = await this.loadProject(projectId);
        // console.log('start project crawler', project);
        return this.startCrawler(projectId, project.crawlerInput, push);
    }

    async startCrawler(projectId: string, crawlerInput: CrawlerInput, push?: (payload: any) => void, runProcess = true): Promise<StartCrawler> {
        await this.cleanHistory(projectId);
        const timestamp = Math.floor(Date.now() / 1000);
        const id = md5(`${timestamp}-${crawlerInput.url}-${JSON.stringify(crawlerInput.viewport)}`);

        const crawler: Crawler = {
            ...crawlerInput,
            timestamp,
            id,
            diffZoneCount: 0,
            errorCount: 0,
            status: 'review',
            inQueue: 1,
            urlsCount: 0,
            startAt: Date.now(),
            lastUpdate: Date.now(),
        };

        const distFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, (timestamp).toString());
        await outputJSON(join(distFolder, '_.json'), crawler, { spaces: 4 });

        if (crawlerInput.method === CrawlerMethod.URLs) {
            await this.startUrlsCrawling(crawlerInput, distFolder);
        } else {
            await this.startSpiderBotCrawling(crawlerInput, distFolder);
        }

        if (runProcess) {
            // exec(`PROCESS_TIMEOUT=60 test-crawler-cli > ${this.getLogFile()} 2>&1 &`);
            // exec(`PROCESS_TIMEOUT=60 npm run cli > ${this.getLogFile()} 2>&1 &`);
            crawl({ projectId, pagesFolder: timestamp.toString() }, 30, push);
        }

        return {
            crawler,
            config: { MAX_HISTORY },
        };
    }

    async startCrawlers(push?: (payload: any) => void) {
        crawl(undefined, 30, push);
    }

    private async startUrlsCrawling(crawlerInput: CrawlerInput, distFolder: string) {
        const { data } = await axios.get(crawlerInput.url);
        const urls = data.split(`\n`).filter((url: string) => url.trim());
        await Promise.all(urls.map((url: string) =>
            addToQueue(url, crawlerInput.viewport, distFolder)));
    }

    private async startSpiderBotCrawling({ url, viewport, limit }: CrawlerInput, distFolder: string) {
        const addedToqueue = await addToQueue(url, viewport, distFolder, limit);
        if (!addedToqueue) {
            throw (new Error('Something went wrong while adding job to queue'));
        }
    }

    private async cleanHistory(projectId: string) {
        const folders = await getFolders(projectId);
        const cleanUp = folders.slice(0, -(MAX_HISTORY - 1));
        cleanUp.forEach((folder) => {
            rimraf.sync(join(CRAWL_FOLDER, folder));
        });
    }
}
