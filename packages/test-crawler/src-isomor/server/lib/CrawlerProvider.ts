import {
    readJson,
} from 'fs-extra';
import { join, extname } from 'path';
import * as md5 from 'md5';
import { groupOverlappingZone } from 'pixdiff-zone';

import { CRAWL_FOLDER, PIN_FOLDER, CODE_FOLDER, PROJECT_FOLDER, ROOT_FOLDER } from './config';
import { getFilePath } from './utils';

import { Crawler, CrawlerInput, PageData, Project, Code, CodeInfoList, Projects, RemoteType } from '../typing';
import { crawl } from './crawl';
import { CrawlerProviderBase, LOCAL } from './CrawlerProviderBase';

export class CrawlerProvider extends CrawlerProviderBase {
    getSettings() {
        return {
            dir: __dirname,
        };
    }

    loadProject(remoteType: RemoteType, projectId: string): Promise<Project> {
        return this.readJSON(remoteType, this.join(projectId, `project.json`));
    }

    async loadProjects(): Promise<Projects> {
        // we should use accumulator
        const localProjects = await this.readdir(RemoteType.Local, PROJECT_FOLDER);
        const githubProjects = await this.readdir(RemoteType.GitHub, PROJECT_FOLDER);
        return {
            [RemoteType.Local]: await Promise.all(
                localProjects.map(projectId => this.loadProject(RemoteType.Local, projectId)),
            ),
            [RemoteType.GitHub]: await Promise.all(
                githubProjects.map(projectId => this.loadProject(RemoteType.GitHub, projectId)),
            ),
        }
    }

    async saveProject(remoteType: RemoteType, crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
        if (!projectId) {
            projectId = md5(name);
        }
        const project = { id: projectId, name, crawlerInput };
        await this.saveJSON(remoteType, 'project.json', project);
        return project;
    }

    getCrawler(remoteType: RemoteType, projectId: string, timestamp: string): Promise<Crawler> {
        const path = this.join(projectId, CRAWL_FOLDER, timestamp, '_.json');
        return this.readJSON(remoteType, path);
    }

    async getAllCrawlers(remoteType: RemoteType, projectId: string): Promise<Crawler[]> {
        const path = this.join(projectId, CRAWL_FOLDER);
        const folders = await this.readdir(remoteType, path);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(timestamp => this.getCrawler(remoteType, projectId, timestamp)),
        );
        return crawlers;
    }

    async copyToPins(remoteType: RemoteType, projectId: string, timestamp: string, id: string): Promise<PageData> {
        const crawlerFolder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const crawlerFolderPath = getFilePath(id, crawlerFolder);

        // set diff to 0
        // instead to load this file again, we could get the data from the frontend?
        const data: PageData = await this.readJSON(remoteType, crawlerFolderPath('json'));
        data.png.diff = {
            pixelDiffRatio: 0,
            zones: [],
        };
        if (data.png.diff.pixelDiffRatio > 0) {
            await this.saveJSON(remoteType, crawlerFolderPath('json'), data);
        }

        // copy files
        const pinFolderPath = getFilePath(id, this.join(projectId, PIN_FOLDER));
        await this.saveJSON(remoteType, pinFolderPath('json'), data);
        await this.copy(remoteType, crawlerFolderPath('html'), pinFolderPath('html'));
        await this.copy(remoteType, crawlerFolderPath('png'), pinFolderPath('png'));

        return data;
    }

    async removeFromPins(remoteType: RemoteType, projectId: string, id: string): Promise<PageData[]> {
        const pinFolderPath = getFilePath(id, this.join(projectId, PIN_FOLDER));

        await this.remove(remoteType, pinFolderPath('png'));
        await this.remove(remoteType, pinFolderPath('html'));
        await this.remove(remoteType, pinFolderPath('json'));

        return this.getPins(remoteType, projectId);
    }

    image(remoteType: RemoteType, projectId: string, folder: string, id: string): Promise<Buffer> {
        const target = folder === 'base'
            ? this.join(projectId, PIN_FOLDER)
            : this.join(projectId, CRAWL_FOLDER, folder);
        return this.blob(remoteType, getFilePath(id, target)('png'));
    }

    async saveCode(remoteType: RemoteType, projectId: string, code: Code): Promise<void> {
        const { source, ...codeInfo } = code;
        const list = await this.getCodeList(remoteType, projectId);
        list[code.id] = codeInfo;
        await this.saveJSON(
            remoteType,
            this.join(projectId, CODE_FOLDER, `list.json`),
            { ...list }); // for some reason it need a copy
        await this.saveFile(
            remoteType,
            this.join(projectId, CODE_FOLDER, `${code.id}.js`),
            source);
    }

    async loadCode(remoteType: RemoteType, projectId: string, id: string): Promise<Code> {
        const list = await this.getCodeList(remoteType, projectId);
        const codeInfo = list[id];
        const sourcePath = this.join(projectId, CODE_FOLDER, `${id}.js`);
        if (codeInfo) {
            const buffer = await this.read(remoteType, sourcePath);
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

    async getCodeList(remoteType: RemoteType, projectId: string, forceLocal = false): Promise<CodeInfoList> {
        const listPath = this.join(projectId, CODE_FOLDER, `list.json`);
        const list = await this.readJSON(remoteType, listPath);
        return list || {};
    }

    getPins(remoteType: RemoteType,projectId: string): Promise<PageData[]> {
        return this.getPinsInFolder(remoteType, this.join(projectId, PIN_FOLDER));
    }

    getPin(remoteType: RemoteType, projectId: string, id: string): Promise<PageData> {
        return this.getPageInFolder(remoteType, this.join(projectId, PIN_FOLDER), id);
    }

    getPages(remoteType: RemoteType, projectId: string, timestamp: string): Promise<PageData[]> {
        return this.getPinsInFolder(
            remoteType,
            this.join(projectId, CRAWL_FOLDER, timestamp),
        );
    }

    private getPageInFolder(remoteType: RemoteType, folder: string, id: string): Promise<PageData> {
        return this.readJSON(remoteType, getFilePath(id, folder)('json'));
    }

    private async getPinsInFolder(remoteType: RemoteType, folder: string): Promise<PageData[]> {
        const files = await this.readdir(remoteType, folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json' && file !== '_.json')
                .map(file => this.readJSON(remoteType, join(folder, file))),
        );
    }

    async setCrawlerStatus(remoteType: RemoteType, projectId: string, timestamp: string, status: string): Promise<Crawler> {
        const file = this.join(projectId, CRAWL_FOLDER, timestamp, '_.json');
        const crawler: Crawler = await this.readJSON(remoteType, file);
        crawler.status = status;
        await this.saveJSON(remoteType, file, crawler);
        return crawler;
    }

    async setZoneStatus(remoteType: RemoteType, projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const data: PageData = await this.readJSON(remoteType, filePath('json'));
        if (status === 'pin') {
            const pinPath = getFilePath(id, this.join(projectId, PIN_FOLDER));
            const pin: PageData = await this.readJSON(remoteType, pinPath('json'));

            pin.png.diff.zones.push({ ...data.png.diff.zones[index], status });
            const zones = pin.png.diff.zones.map(item => item.zone);
            zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
            const groupedZones = groupOverlappingZone(zones);
            pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));

            await this.saveJSON(remoteType, pinPath('json'), pin);
        }
        data.png.diff.zones[index].status = status;
        await this.saveJSON(remoteType, filePath('json'), data);
        return data;
    }

    async setZonesStatus(remoteType: RemoteType, projectId: string, timestamp: string, id: string, status: string): Promise<PageData> {
        const folder = this.join(projectId, CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        const page: PageData = await this.readJSON(remoteType, filePath('json'));
        let newPage: PageData;
        for (let index = 0; index < page.png.diff.zones.length; index++) {
            newPage = await this.setZoneStatus(remoteType, projectId, timestamp, id, index, status);
        }
        return newPage;
    }

    async startCrawler(remoteType: RemoteType, projectId: string, push?: (payload: any) => void): Promise<string> {
        const pagesFolder = Math.floor(Date.now() / 1000).toString();
        this.crawl(remoteType, projectId, pagesFolder, 30, push);

        return pagesFolder;
    }

    async startCrawlers(push?: (payload: any) => void) {
        // for the moment this would only start locally
        // we will have to make a specific one to start remotely
        crawl(undefined, 30, push);
    }
}
