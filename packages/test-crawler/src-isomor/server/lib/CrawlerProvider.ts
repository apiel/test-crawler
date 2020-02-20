import { join, extname } from 'path';
import * as md5 from 'md5';
import { groupOverlappingZone } from 'pixdiff-zone';
import { WsContext, Context } from 'isomor-server';

import { CRAWL_FOLDER, PIN_FOLDER, CODE_FOLDER, PROJECT_FOLDER } from './config';

import { Crawler, CrawlerInput, PageData, Project, Code, CodeInfoList, StartCrawler, BeforeAfterType, Browser, ZoneStatus } from '../typing';
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

        const jsonFile = join(crawlerFolder, `${id}.json`);
        const htmlFile = join(crawlerFolder, `${id}.html`);
        const pngFile = join(crawlerFolder, `${id}.png`);

        // set diff to 0
        // instead to load this file again, we could get the data from the frontend?
        const data: PageData = await this.storage.readJSON(jsonFile);
        if (data?.png) {
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                await this.storage.saveJSON(jsonFile, data);
            }
        }

        const pinJsonFile = this.join(projectId, PIN_FOLDER, `${id}.json`);
        const pinHtmlFile = this.join(projectId, PIN_FOLDER, `${id}.html`);
        const pinPngFile = this.join(projectId, PIN_FOLDER, `${id}.png`);

        // copy files
        await this.storage.saveJSON(pinJsonFile, data);
        await this.storage.copy(htmlFile, pinHtmlFile);

        // await this.storage.copyBlob(crawlerFolderPath('png'), pinFolderPath('png'));
        this.storage.copyBlob(pngFile, pinPngFile); // dont wait for it, to slow, we will fix it soon

        return data;
    }

    async removeFromPins(projectId: string, id: string): Promise<PageData[]> {
        await this.storage.remove(this.join(projectId, PIN_FOLDER, `${id}.png`));
        await this.storage.remove(this.join(projectId, PIN_FOLDER, `${id}.html`));
        await this.storage.remove(this.join(projectId, PIN_FOLDER, `${id}.json`));

        return this.getPins(projectId);
    }

    image(projectId: string, folder: string, id: string) {
        const target = folder === 'base'
            ? this.join(projectId, PIN_FOLDER)
            : this.join(projectId, CRAWL_FOLDER, folder);
        return this.storage.blob(join(target, `${id}.png`));
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
            const buf = await this.storage.read(this.join(projectId, `${type}.js`));
            return buf?.toString() || '';
        } catch (err) { }
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

    async getCodeList(projectId: string): Promise<CodeInfoList> {
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
        return this.storage.readJSON(join(folder, `${id}.json`));

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

    async setZoneStatus(projectId: string, timestamp: string, id: string, status: ZoneStatus, index?: number): Promise<PageData[]> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const fileJson = join(folder, `${id}.json`)
        const data: PageData = await this.storage.readJSON(fileJson);
        if (index && status === ZoneStatus.zonePin) {
            const pinJsonFile = this.join(projectId, PIN_FOLDER, `${id}.json`);
            const pin: PageData = await this.storage.readJSON(pinJsonFile);

            if (pin?.png?.diff?.zones && data?.png?.diff?.zones) {
                if (index) {
                    pin.png.diff.zones.push({ ...data.png.diff.zones[index], status });
                }
                const zones = pin.png.diff.zones.map(item => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = groupOverlappingZone(zones);
                pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
            }

            await this.storage.saveJSON(pinJsonFile, pin);
        }
        if (data?.png?.diff?.zones) {
            if (index) {
                data.png.diff.zones[index].status = status;
            } else {
                data.png.diff.zones.forEach(zone => zone.status = status);
            }
        }
        await this.storage.saveJSON(fileJson, data);
        return this.getPages(projectId, timestamp);
    }

    async startCrawler(projectId: string, browser?: Browser): Promise<StartCrawler> {
        const timestamp = Math.floor(Date.now() / 1000).toString();

        const crawlTarget = { projectId, timestamp };
        const redirect = await this.storage.crawl(crawlTarget, 30, (this.ctx as any)?.push, browser);

        return {
            timestamp,
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
