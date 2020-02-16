import { join, extname } from 'path';
import * as md5 from 'md5';
import { groupOverlappingZone } from 'pixdiff-zone';
import { WsContext, Context } from 'isomor-server';

import { CRAWL_FOLDER, PIN_FOLDER, CODE_FOLDER, PROJECT_FOLDER } from './config';
import { getFilePath } from './utils';

import { Crawler, CrawlerInput, PageData, Project, Code, CodeInfoList, StartCrawler, BeforeAfterType, Browser } from '../typing';
import { StorageType } from '../storage.typing';
import { CrawlerProviderStorage } from './CrawlerProviderStorage';

export class CrawlerProvider extends CrawlerProviderStorage {
    constructor(storageType?: StorageType, public ctx?: undefined | WsContext | Context) {
        super(storageType, ctx);
    }

    repos() {
        return this.storage.repos();
    }

    repo() {
        return this.storage.getRepo();
    }

    info() {
        return this.storage.info();
    }

    jobs(projectId: string) {
        return this.storage.jobs(projectId);
    }

    loadProject(projectId: string): Promise<Project> {
        return this.storage.readJSON(this.join(projectId, `project.json`));
    }

    async loadProjects(): Promise<Project[]> {
        // we should use accumulator
        const projects = await this.storage.readdir(PROJECT_FOLDER);
        console.log('projects', { projects });
        return Promise.all(
            projects.map(projectId => this.loadProject(projectId)),
        );
    }

    async saveProject(crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
        if (!projectId) {
            projectId = (md5 as any)(name) as string;
        }
        const project = { id: projectId, name, crawlerInput };
        await this.storage.saveJSON(this.join(projectId, 'project.json'), project);
        return project;
    }

    getCrawler(projectId: string, timestamp: string): Promise<Crawler> {
        const path = this.join(projectId, CRAWL_FOLDER, timestamp, '_.json');
        return this.storage.readJSON(path);
    }

    async getAllCrawlers(projectId: string): Promise<Crawler[]> {
        const path = this.join(projectId, CRAWL_FOLDER);
        const folders = await this.storage.readdir(path);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(timestamp => this.getCrawler(projectId, timestamp)),
        );
        return crawlers;
    }

    async copyToPins(projectId: string, timestamp: string, id: string): Promise<PageData> {
        const crawlerFolder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const crawlerFolderPath = getFilePath(id, crawlerFolder);

        // set diff to 0
        // instead to load this file again, we could get the data from the frontend?
        const data: PageData = await this.storage.readJSON(crawlerFolderPath('json'));
        if (data?.png) {
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                await this.storage.saveJSON(crawlerFolderPath('json'), data);
            }
        }

        // copy files
        const pinFolderPath = getFilePath(id, this.join(projectId, PIN_FOLDER));
        await this.storage.saveJSON(pinFolderPath('json'), data);
        await this.storage.copy(crawlerFolderPath('html'), pinFolderPath('html'));
        await this.storage.copyBlob(crawlerFolderPath('png'), pinFolderPath('png'));

        return data;
    }

    async removeFromPins(projectId: string, id: string): Promise<PageData[]> {
        const pinFolderPath = getFilePath(id, this.join(projectId, PIN_FOLDER));

        await this.storage.remove(pinFolderPath('png'));
        await this.storage.remove(pinFolderPath('html'));
        await this.storage.remove(pinFolderPath('json'));

        return this.getPins(projectId);
    }

    image(projectId: string, folder: string, id: string) {
        const target = folder === 'base'
            ? this.join(projectId, PIN_FOLDER)
            : this.join(projectId, CRAWL_FOLDER, folder);
        return this.storage.blob(getFilePath(id, target)('png'));
    }

    saveBeforeAfterCode(projectId: string, type: BeforeAfterType, code: string): Promise<void> {
        if (!Object.values(BeforeAfterType).includes(type)) {
            throw new Error(`Unknown code type ${type}.`);
        }
        const file = this.join(projectId, `${type}.js`);
        if (!code.length) {
            return this.storage.remove(file);
        }
        return this.storage.saveFile(file, code);
    }

    async getBeforeAfterCode(projectId: string, type: BeforeAfterType): Promise<string> {
        if (!Object.values(BeforeAfterType).includes(type)) {
            throw new Error(`Unknown code type ${type}.`);
        }
        try {
            const buf = await this.storage.read(this.join(projectId, `${type}`));
            return buf?.toString() || '';   
        } catch (err) {}
        return '';
    }

    async saveCode(projectId: string, code: Code): Promise<void> {
        const { source, ...codeInfo } = code;
        const list = await this.getCodeList(projectId);
        list[code.id] = codeInfo;
        await this.storage.saveJSON(
            this.join(projectId, CODE_FOLDER, `list.json`),
            { ...list }); // for some reason it need a copy
        await this.storage.saveFile(
            this.join(projectId, CODE_FOLDER, `${code.id}.js`),
            source);
    }

    async loadCode(projectId: string, id: string): Promise<Code> {
        const list = await this.getCodeList(projectId);
        const codeInfo = list[id];
        const sourcePath = this.join(projectId, CODE_FOLDER, `${id}.js`);
        if (codeInfo) {
            const buffer = await this.storage.read(sourcePath);
            if (buffer) {
                const source = buffer.toString();
                return { ...codeInfo, source };
            }
        }
        return {
            id,
            name: '',
            pattern: '',
            source: '',
        };
    }

    async getCodeList(projectId: string, forceLocal = false): Promise<CodeInfoList> {
        const listPath = this.join(projectId, CODE_FOLDER, `list.json`);
        const list = await this.storage.readJSON(listPath);
        return list || {};
    }

    getPins(projectId: string): Promise<PageData[]> {
        return this.getPinsInFolder(this.join(projectId, PIN_FOLDER));
    }

    getPin(projectId: string, id: string): Promise<PageData> {
        return this.getPageInFolder(this.join(projectId, PIN_FOLDER), id);
    }

    getPages(projectId: string, timestamp: string): Promise<PageData[]> {
        return this.getPinsInFolder(this.join(projectId, CRAWL_FOLDER, timestamp));
    }

    private getPageInFolder(folder: string, id: string): Promise<PageData> {
        return this.storage.readJSON(getFilePath(id, folder)('json'));
    }

    private async getPinsInFolder(folder: string): Promise<PageData[]> {
        const files = await this.storage.readdir(folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json' && file !== '_.json')
                .map(file => this.storage.readJSON(join(folder, file))),
        );
    }

    async setCrawlerStatus(projectId: string, timestamp: string, status: string): Promise<Crawler> {
        const file = this.join(projectId, CRAWL_FOLDER, timestamp, '_.json');
        const crawler: Crawler = await this.storage.readJSON(file);
        crawler.status = status;
        await this.storage.saveJSON(file, crawler);
        return crawler;
    }

    async setZoneStatus(projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const data: PageData = await this.storage.readJSON(filePath('json'));
        if (status === 'pin') {
            const pinPath = getFilePath(id, this.join(projectId, PIN_FOLDER));
            const pin: PageData = await this.storage.readJSON(pinPath('json'));

            if (pin?.png?.diff?.zones && data?.png?.diff?.zones) {
                pin.png.diff.zones.push({ ...data.png.diff.zones[index], status });
                const zones = pin.png.diff.zones.map(item => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = groupOverlappingZone(zones);
                pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
            }

            await this.storage.saveJSON(pinPath('json'), pin);
        }
        if (data?.png?.diff?.zones) {
            data.png.diff.zones[index].status = status;
        }
        await this.storage.saveJSON(filePath('json'), data);
        return data;
    }

    async setZonesStatus(projectId: string, timestamp: string, id: string, status: string): Promise<PageData> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const page: PageData = await this.storage.readJSON(filePath('json'));
        let newPage: PageData;
        for (let index = 0; index < page!.png!.diff!.zones.length; index++) {
            newPage = await this.setZoneStatus(projectId, timestamp, id, index, status);
        }
        return newPage!;
    }

    async startCrawler(projectId: string, browser?: Browser): Promise<StartCrawler> {
        const pagesFolder = Math.floor(Date.now() / 1000).toString();

        const crawlTarget = { projectId, pagesFolder };
        const redirect = await this.storage.crawl(crawlTarget, 30, (this.ctx as any)?.push, browser);

        return {
            timestamp: pagesFolder,
            redirect,
        };
    }

    get browsers(): Browser[] {
        return this.storage.browsers;
    }

    protected join(projectId: string, ...path: string[]) {
        return join(PROJECT_FOLDER, projectId, ...path);
    }
}
