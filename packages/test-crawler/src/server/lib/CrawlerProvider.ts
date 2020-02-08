import { join, extname } from 'path';
import * as md5 from 'md5';
import { groupOverlappingZone } from 'pixdiff-zone';

import { CRAWL_FOLDER, PIN_FOLDER, CODE_FOLDER, PROJECT_FOLDER } from './config';
import { getFilePath } from './utils';

import { Crawler, CrawlerInput, PageData, Project, Code, CodeInfoList } from '../typing';
import { CrawlerProviderBase } from './CrawlerProviderBase';
import { StorageType } from '../storage.typing';

export class CrawlerProvider extends CrawlerProviderBase {
    getSettings() {
        return {
            dir: __dirname,
        };
    }

    loadProject(storageType: StorageType, projectId: string): Promise<Project> {
        return this.readJSON(storageType, this.join(projectId, `project.json`));
    }

    async loadProjects(storageType: StorageType): Promise<Project[]> {
        // we should use accumulator
        const projects = await this.readdir(storageType, PROJECT_FOLDER);
        return Promise.all(
            projects.map(projectId => this.loadProject(storageType, projectId)),
        );
    }

    async saveProject(storageType: StorageType, crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
        if (!projectId) {
            projectId = (md5 as any)(name) as string;
        }
        const project = { id: projectId, name, crawlerInput };
        await this.saveJSON(storageType, 'project.json', project);
        return project;
    }

    getCrawler(storageType: StorageType, projectId: string, timestamp: string): Promise<Crawler> {
        const path = this.join(projectId, CRAWL_FOLDER, timestamp, '_.json');
        return this.readJSON(storageType, path);
    }

    async getAllCrawlers(storageType: StorageType, projectId: string): Promise<Crawler[]> {
        const path = this.join(projectId, CRAWL_FOLDER);
        const folders = await this.readdir(storageType, path);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(timestamp => this.getCrawler(storageType, projectId, timestamp)),
        );
        return crawlers;
    }

    async copyToPins(storageType: StorageType, projectId: string, timestamp: string, id: string): Promise<PageData> {
        const crawlerFolder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const crawlerFolderPath = getFilePath(id, crawlerFolder);

        // set diff to 0
        // instead to load this file again, we could get the data from the frontend?
        const data: PageData = await this.readJSON(storageType, crawlerFolderPath('json'));
        if (data?.png) {
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                await this.saveJSON(storageType, crawlerFolderPath('json'), data);
            }
        }

        // copy files
        const pinFolderPath = getFilePath(id, this.join(projectId, PIN_FOLDER));
        await this.saveJSON(storageType, pinFolderPath('json'), data);
        await this.copy(storageType, crawlerFolderPath('html'), pinFolderPath('html'));
        await this.copy(storageType, crawlerFolderPath('png'), pinFolderPath('png'));

        return data;
    }

    async removeFromPins(storageType: StorageType, projectId: string, id: string): Promise<PageData[]> {
        const pinFolderPath = getFilePath(id, this.join(projectId, PIN_FOLDER));

        await this.remove(storageType, pinFolderPath('png'));
        await this.remove(storageType, pinFolderPath('html'));
        await this.remove(storageType, pinFolderPath('json'));

        return this.getPins(storageType, projectId);
    }

    image(storageType: StorageType, projectId: string, folder: string, id: string) {
        const target = folder === 'base'
            ? this.join(projectId, PIN_FOLDER)
            : this.join(projectId, CRAWL_FOLDER, folder);
        return this.blob(storageType, getFilePath(id, target)('png'));
    }

    async saveCode(storageType: StorageType, projectId: string, code: Code): Promise<void> {
        const { source, ...codeInfo } = code;
        const list = await this.getCodeList(storageType, projectId);
        list[code.id] = codeInfo;
        await this.saveJSON(
            storageType,
            this.join(projectId, CODE_FOLDER, `list.json`),
            { ...list }); // for some reason it need a copy
        await this.saveFile(
            storageType,
            this.join(projectId, CODE_FOLDER, `${code.id}.js`),
            source);
    }

    async loadCode(storageType: StorageType, projectId: string, id: string): Promise<Code> {
        const list = await this.getCodeList(storageType, projectId);
        const codeInfo = list[id];
        const sourcePath = this.join(projectId, CODE_FOLDER, `${id}.js`);
        if (codeInfo) {
            const buffer = await this.read(storageType, sourcePath);
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

    async getCodeList(storageType: StorageType, projectId: string, forceLocal = false): Promise<CodeInfoList> {
        const listPath = this.join(projectId, CODE_FOLDER, `list.json`);
        const list = await this.readJSON(storageType, listPath);
        return list || {};
    }

    getPins(storageType: StorageType, projectId: string): Promise<PageData[]> {
        return this.getPinsInFolder(storageType, this.join(projectId, PIN_FOLDER));
    }

    getPin(storageType: StorageType, projectId: string, id: string): Promise<PageData> {
        return this.getPageInFolder(storageType, this.join(projectId, PIN_FOLDER), id);
    }

    getPages(storageType: StorageType, projectId: string, timestamp: string): Promise<PageData[]> {
        return this.getPinsInFolder(
            storageType,
            this.join(projectId, CRAWL_FOLDER, timestamp),
        );
    }

    private getPageInFolder(storageType: StorageType, folder: string, id: string): Promise<PageData> {
        return this.readJSON(storageType, getFilePath(id, folder)('json'));
    }

    private async getPinsInFolder(storageType: StorageType, folder: string): Promise<PageData[]> {
        const files = await this.readdir(storageType, folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json' && file !== '_.json')
                .map(file => this.readJSON(storageType, join(folder, file))),
        );
    }

    async setCrawlerStatus(storageType: StorageType, projectId: string, timestamp: string, status: string): Promise<Crawler> {
        const file = this.join(projectId, CRAWL_FOLDER, timestamp, '_.json');
        const crawler: Crawler = await this.readJSON(storageType, file);
        crawler.status = status;
        await this.saveJSON(storageType, file, crawler);
        return crawler;
    }

    async setZoneStatus(storageType: StorageType, projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const data: PageData = await this.readJSON(storageType, filePath('json'));
        if (status === 'pin') {
            const pinPath = getFilePath(id, this.join(projectId, PIN_FOLDER));
            const pin: PageData = await this.readJSON(storageType, pinPath('json'));

            if (pin?.png?.diff?.zones && data?.png?.diff?.zones) {
                pin.png.diff.zones.push({ ...data.png.diff.zones[index], status });
                const zones = pin.png.diff.zones.map(item => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = groupOverlappingZone(zones);
                pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
            }

            await this.saveJSON(storageType, pinPath('json'), pin);
        }
        if (data?.png?.diff?.zones) {
            data.png.diff.zones[index].status = status;
        }
        await this.saveJSON(storageType, filePath('json'), data);
        return data;
    }

    async setZonesStatus(storageType: StorageType, projectId: string, timestamp: string, id: string, status: string): Promise<PageData> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const page: PageData = await this.readJSON(storageType, filePath('json'));
        let newPage: PageData;
        for (let index = 0; index < page!.png!.diff!.zones.length; index++) {
            newPage = await this.setZoneStatus(storageType, projectId, timestamp, id, index, status);
        }
        return newPage!;
    }

    async startCrawler(storageType: StorageType, projectId: string, push?: (payload: any) => void): Promise<string> {
        const pagesFolder = Math.floor(Date.now() / 1000).toString();
        this.crawl(storageType, projectId, pagesFolder, 30, push);

        return pagesFolder;
    }
}
