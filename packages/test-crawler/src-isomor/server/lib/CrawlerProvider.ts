import { join, extname } from 'path';
import * as md5 from 'md5';
import { WsContext, Context } from 'isomor-server';
import { ChangesToApply } from 'test-crawler-apply';

import { CRAWL_FOLDER, PIN_FOLDER, CODE_FOLDER, PROJECT_FOLDER } from './config';
import { getFilePath } from './utils';

import { Crawler, CrawlerInput, PageData, Project, Code, CodeInfoList, StartCrawler, BeforeAfterType, Browser, ChangeItem, ChangeType } from '../typing';
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

    applyChanges(changes: ChangeItem[]): Promise<void> {
        const changesToApply: ChangesToApply[] = [];
        for (const { item } of changes) {
            if (item.type === ChangeType.pin) {
                const { projectId, timestamp, id } = item.props;
                const srcBase = this.join(projectId, CRAWL_FOLDER, timestamp, id);
                const dstBase = this.join(projectId, PIN_FOLDER, id);
                changesToApply.push({
                    type: 'copyToPins',
                    props: { srcBase, dstBase },
                });
            } else if (item.type === ChangeType.setZoneStatus) {
                const { projectId, timestamp, id, index, status } = item.props;
                const jsonFile = this.join(projectId, CRAWL_FOLDER, timestamp, `${id}.json`);
                const pinJsonFile = this.join(projectId, PIN_FOLDER, `${id}.json`);
                changesToApply.push({
                    type: 'setZoneStatus',
                    props: { jsonFile, pinJsonFile, index, status },
                });
            }
        }
        return this.storage.applyChanges(changesToApply);
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
