import {
    readJson,
} from 'fs-extra';
import { join, extname } from 'path';
import * as md5 from 'md5';
import { groupOverlappingZone } from 'pixdiff-zone';

import { CRAWL_FOLDER, PIN_FOLDER, CODE_FOLDER } from './config';
import { getFilePath } from './utils';

import { Crawler, CrawlerInput, PageData, Project, Code, CodeInfoList } from '../typing';
import { crawl } from './crawl';
import { CrawlerProviderBase, LOCAL } from './CrawlerProviderBase';

export class CrawlerProvider extends CrawlerProviderBase {
    getSettings() {
        return {
            dir: __dirname,
        };
    }

    loadProject(projectId: string): Promise<Project> {
        return this.readJSON(projectId, `project.json`, LOCAL);
    }

    async loadProjects(): Promise<Project[]> {
        const projects = await this.readdir('', '', LOCAL); // to get list of the root folder
        return Promise.all(
            projects.map(projectId => this.loadProject(projectId)),
        );
    }

    async saveProject(crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
        if (!projectId) {
            projectId = md5(name);
        }
        const project = { id: projectId, name, crawlerInput };
        await this.saveJSON(projectId, 'project.json', project, LOCAL);
        return project;
    }

    getCrawler(projectId: string, timestamp: string): Promise<Crawler> {
        return this.readJSON(projectId, join(CRAWL_FOLDER, timestamp, '_.json'));
    }

    async getAllCrawlers(projectId: string): Promise<Crawler[]> {
        const folders = await this.readdir(projectId, CRAWL_FOLDER);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(timestamp => this.getCrawler(projectId, timestamp)),
        );
        return crawlers;
    }

    async copyToPins(projectId: string, timestamp: string, id: string, forceLocal = false): Promise<PageData> {
        const crawlerFolder = join(CRAWL_FOLDER, timestamp);
        const crawlerFolderPath = getFilePath(id, crawlerFolder);

        // set diff to 0
        // instead to load this file again, we could get the data from the frontend?
        const data: PageData = await this.readJSON(projectId, crawlerFolderPath('json'), forceLocal);
        data.png.diff = {
            pixelDiffRatio: 0,
            zones: [],
        };
        if (data.png.diff.pixelDiffRatio > 0) {
            await this.saveJSON(projectId, crawlerFolderPath('json'), data, forceLocal);
        }

        // copy files
        const pinFolderPath = getFilePath(id, PIN_FOLDER);
        await this.saveJSON(projectId, pinFolderPath('json'), data, forceLocal);
        await this.copy(projectId, crawlerFolderPath('html'), pinFolderPath('html'), forceLocal);
        await this.copy(projectId, crawlerFolderPath('png'), pinFolderPath('png'), forceLocal);

        return data;
    }

    async removeFromPins(projectId: string, id: string): Promise<PageData[]> {
        const pinFolderPath = getFilePath(id, PIN_FOLDER);

        await this.remove(projectId, pinFolderPath('png'));
        await this.remove(projectId, pinFolderPath('html'));
        await this.remove(projectId, pinFolderPath('json'));

        return this.getPins(projectId);
    }

    image(projectId: string, folder: string, id: string): Promise<Buffer> {
        const target = folder === 'base' ? PIN_FOLDER : join(CRAWL_FOLDER, folder);
        return this.read(projectId, getFilePath(id, target)('png'));
    }

    async saveCode(projectId: string, code: Code): Promise<void> {
        const { source, ...codeInfo } = code;
        const list = await this.getCodeList(projectId);
        list[code.id] = codeInfo;
        await this.saveJSON(projectId, join(CODE_FOLDER, `list.json`), { ...list }); // for some reason it need a copy
        await this.saveFile(projectId, join(CODE_FOLDER, `${code.id}.js`), source);
    }

    async loadCode(projectId: string, id: string): Promise<Code> {
        const list = await this.getCodeList(projectId);
        const codeInfo = list[id];
        const sourcePath = join(CODE_FOLDER, `${id}.js`);
        if (codeInfo) {
            const buffer = await this.read(projectId, sourcePath);
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
        const listPath = join(CODE_FOLDER, `list.json`);
        const list = await this.readJSON(projectId, listPath, forceLocal);
        return list || {};
    }

    getPins(projectId: string): Promise<PageData[]> {
        return this.getPinsInFolder(projectId, PIN_FOLDER);
    }

    getPin(projectId: string, id: string): Promise<PageData> {
        return this.getPageInFolder(projectId, PIN_FOLDER, id);
    }

    getPages(projectId: string, timestamp: string): Promise<PageData[]> {
        return this.getPinsInFolder(projectId, join(CRAWL_FOLDER, timestamp));
    }

    private getPageInFolder(projectId: string, folder: string, id: string): Promise<PageData> {
        return this.readJSON(projectId, getFilePath(id, folder)('json'));
    }

    private async getPinsInFolder(projectId: string, folder: string): Promise<PageData[]> {
        const files = await this.readdir(projectId, folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json' && file !== '_.json')
                .map(file => this.readJSON(projectId, join(folder, file))),
        );
    }

    async setCrawlerStatus(projectId: string, timestamp: string, status: string): Promise<Crawler> {
        const file = join(CRAWL_FOLDER, timestamp, '_.json');
        const crawler: Crawler = await this.readJSON(projectId, file);
        crawler.status = status;
        await this.saveJSON(projectId, file, crawler);
        return crawler;
    }

    async setZoneStatus(projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData> {
        const folder = join(CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const data: PageData = await this.readJSON(projectId, filePath('json'));
        if (status === 'pin') {
            const pinPath = getFilePath(id, PIN_FOLDER);
            const pin: PageData = await readJson(pinPath('json'));

            pin.png.diff.zones.push({ ...data.png.diff.zones[index], status });
            const zones = pin.png.diff.zones.map(item => item.zone);
            zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
            const groupedZones = groupOverlappingZone(zones);
            pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));

            await this.saveJSON(projectId, pinPath('json'), pin);
        }
        data.png.diff.zones[index].status = status;
        await this.saveJSON(projectId, filePath('json'), data);
        return data;
    }

    async setZonesStatus(projectId: string, timestamp: string, id: string, status: string): Promise<PageData> {
        const folder = join(CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const page: PageData = await this.readJSON(projectId, filePath('json'));
        let newPage: PageData;
        for (let index = 0; index < page.png.diff.zones.length; index++) {
            newPage = await this.setZoneStatus(projectId, timestamp, id, index, status);
        }
        return newPage;
    }

    async startCrawler(projectId: string, push?: (payload: any) => void): Promise<string> {
        const pagesFolder = Math.floor(Date.now() / 1000).toString();
        this.crawl(projectId, pagesFolder, 30, push);

        return pagesFolder;
    }

    async startCrawlers(push?: (payload: any) => void) {
        // for the moment this would only start locally
        // we will have to make a specific one to start remotely
        crawl(undefined, 30, push);
    }
}
