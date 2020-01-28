import {
    readdir,
    readJSON,
    outputJSON,
    outputFile,
    readFile,
    pathExists,
    copy,
    readJson,
    mkdirp,
} from 'fs-extra';
import { join, extname } from 'path';
import * as rimraf from 'rimraf';
import * as md5 from 'md5';
import axios from 'axios';
import { exec } from 'child_process';
import { groupOverlappingZone } from 'pixdiff-zone';

import { CRAWL_FOLDER, MAX_HISTORY, BASE_FOLDER, PROJECT_FOLDER, CODE_FOLDER } from './config';
import { getFolders, addToQueue, getFilePath, FilePath, getCodeList } from './utils';

import * as config from './config';
import { Crawler, CrawlerInput, StartCrawler, PageData, Project, Code, CodeInfoList } from '../typing';
import { crawl } from './crawl';

export const getConfig = () => config;
export const CrawlerMethod = {
    URLs: 'urls',
    SPIDER_BOT: 'spiderbot',
};

export class CrawlerProvider {
    private async copyFile(filePath: FilePath, basePath: FilePath, extension: string) {
        const file = filePath(extension);
        if (await pathExists(file)) {
            await copy(file, basePath(extension), { overwrite: true });
        }
    }

    getSettings() {
        return {
            dir: __dirname,
        };
    }

    async setZoneStatus(timestamp: string, id: string, index: number, status: string): Promise<PageData> {
        const folder = join(CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const data: PageData = await readJson(filePath('json'));
        if (status === 'pin') {
            const basePath = getFilePath(id, BASE_FOLDER);
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

    async setZonesStatus(timestamp: string, id: string, status: string): Promise<PageData> {
        const folder = join(CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const page: PageData = await readJson(filePath('json'));
        let newPage: PageData;
        for (let index = 0; index < page.png.diff.zones.length; index++) {
            newPage = await this.setZoneStatus(timestamp, id, index, status);
        }
        return newPage;
    }

    async copyToBase(timestamp: string, id: string): Promise<PageData> {
        await mkdirp(BASE_FOLDER);
        const folder = join(CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const basePath = getFilePath(id, BASE_FOLDER);

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

    image(folder: string, id: string): Promise<Buffer> {
        const target = folder === 'base' ? BASE_FOLDER : join(CRAWL_FOLDER, folder);
        const filePath = getFilePath(id, target);
        return readFile(filePath('png'));
    }

    async saveCode(code: Code): Promise<void> {
        const { source, ...codeInfo } = code;
        const list = await this.getCodeList();
        list[code.id] = codeInfo;
        outputJSON(join(CODE_FOLDER, `list.json`), { ...list }, { spaces: 4 }); // for some reason it need a copy
        outputFile(join(CODE_FOLDER, `${code.id}.js`), source);
    }

    async loadCode(id: string): Promise<Code> {
        const list = await this.getCodeList();
        const codeInfo = list[id];
        const sourcePath = join(CODE_FOLDER, `${id}.js`);
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

    async getCodeList(): Promise<CodeInfoList> {
        return getCodeList();
    }

    getBasePages(): Promise<PageData[]> {
        return this.getPagesInFolder(BASE_FOLDER);
    }

    getBasePage(id: string): Promise<PageData> {
        return this.getPageInFolder(BASE_FOLDER, id);
    }

    getPages(timestamp: string): Promise<PageData[]> {
        const folder = join(CRAWL_FOLDER, timestamp);
        return this.getPagesInFolder(folder);
    }

    private getPageInFolder(folder: string, id: string): Promise<PageData> {
        const filePath = getFilePath(id, folder);
        return readJSON(filePath('json'));
    }

    private async getPagesInFolder(folder: string): Promise<PageData[]> {
        await mkdirp(folder);
        const files = await readdir(folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json' && file !== '_.json')
                .map(file => readJSON(join(folder, file))),
        );
    }

    async setCrawlerStatus(timestamp: string, status: string): Promise<Crawler> {
        const file = join(CRAWL_FOLDER, timestamp, '_.json');
        const crawler: Crawler = await readJson(file);
        crawler.status = status;
        await outputJSON(file, crawler, { spaces: 4 });
        return crawler;
    }

    getCrawler(timestamp: string): Promise<Crawler> {
        return readJSON(join(CRAWL_FOLDER, timestamp, '_.json'));
    }

    async getAllCrawlers(): Promise<Crawler[]> {
        await mkdirp(CRAWL_FOLDER);
        const folders = await readdir(CRAWL_FOLDER);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(folder => readJSON(join(
                CRAWL_FOLDER,
                folder,
                '_.json',
            ))),
        );
        return crawlers;
    }

    async loadProjects(): Promise<Project[]> {
        await mkdirp(PROJECT_FOLDER);
        const files = await readdir(PROJECT_FOLDER);
        return Promise.all(
            files.filter(file => extname(file) === '.json')
                .map(file => readJSON(join(PROJECT_FOLDER, file))),
        );
    }

    async saveProject(crawlerInput: CrawlerInput, name: string): Promise<string> {
        const id = md5(name);
        const file = join(PROJECT_FOLDER, `${id}.json`);
        await outputJSON(file, { id, name, crawlerInput }, { spaces: 4 });
        return id;
    }

    async startCrawlerFromProject(file: string): Promise<CrawlerInput> {
        const { crawlerInput } = await readJSON(file);
        await this.startCrawler(crawlerInput, false);
        return crawlerInput;
    }

    async startCrawler(crawlerInput: CrawlerInput, runProcess = true): Promise<StartCrawler> {
        await this.cleanHistory();
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

        const distFolder = join(CRAWL_FOLDER, (timestamp).toString());
        await outputJSON(join(distFolder, '_.json'), crawler, { spaces: 4 });

        if (crawlerInput.method === CrawlerMethod.URLs) {
            await this.startUrlsCrawling(crawlerInput, distFolder);
        } else {
            await this.startSpiderBotCrawling(crawlerInput, distFolder);
        }

        if (runProcess) {
            // exec(`PROCESS_TIMEOUT=60 test-crawler-cli > ${this.getLogFile()} 2>&1 &`);
            // exec(`PROCESS_TIMEOUT=60 npm run cli > ${this.getLogFile()} 2>&1 &`);
            crawl(timestamp.toString());
        }

        return {
            crawler,
            config: { MAX_HISTORY },
        };
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

    private async cleanHistory() {
        const folders = await getFolders();
        const cleanUp = folders.slice(0, -(MAX_HISTORY - 1));
        cleanUp.forEach((folder) => {
            rimraf.sync(join(CRAWL_FOLDER, folder));
        });
    }
}
