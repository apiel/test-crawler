import {
    CrawlerProvider,
} from './lib';

import {
    Crawler,
    CrawlerInput,
    PageData,
    Project,
    Code,
    CodeInfoList,
    StartCrawler,
} from './typing';
import { StorageType } from './storage.typing';

// Force getSettings to be a async since crawlerProvider.getSettings is sync
export async function getSettings() {
    return {
        dir: __dirname,
    }
}

export function getInfo(storageType: StorageType) {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.info();
}

export function getRepo(storageType: StorageType) {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.repo();
}

export function loadRepos(storageType: StorageType) {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.repos();
}

export function loadProject(storageType: StorageType, projectId: string): Promise<Project> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.loadProject(projectId);
}

export function loadProjects(storageType: StorageType): Promise<Project[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.loadProjects();
}

export function saveProject(storageType: StorageType, crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.saveProject(crawlerInput, name, projectId);
}

export function getCrawler(storageType: StorageType, projectId: string, timestamp: string): Promise<Crawler> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.getCrawler(projectId, timestamp);
}

export function getCrawlers(storageType: StorageType, projectId: string): Promise<Crawler[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.getAllCrawlers(projectId);
}

export function getPages(storageType: StorageType, projectId: string, timestamp: string): Promise<PageData[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.getPages(projectId, timestamp);
}

export function getPins(storageType: StorageType, projectId: string): Promise<PageData[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.getPins(projectId);
}

export function getPin(storageType: StorageType, projectId: string, id: string): Promise<PageData> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.getPin(projectId, id);
}

export function setCode(storageType: StorageType, projectId: string, code: Code): Promise<void> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.saveCode(projectId, code);
}

export function getCode(storageType: StorageType, projectId: string, id: string): Promise<Code> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.loadCode(projectId, id);
}

export function getCodes(storageType: StorageType, projectId: string): Promise<CodeInfoList> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.getCodeList(projectId);
}

export async function getThumbnail(storageType: StorageType, projectId: string, folder: string, id: string, width: number = 300): Promise<string> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    const image = await crawlerProvider.image(projectId, folder, id);
    if (!image) {
        throw new Error('Cannot load image.');
    }
    // const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    // return `data:image/png;base64, ${(await image.toBuffer()).toString('base64')}`;
    return `data:image/png;base64, ${(image).toString('base64')}`;
}

export function removePin(storageType: StorageType, projectId: string, id: string): Promise<PageData[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.removeFromPins(projectId, id);
}

export function pin(storageType: StorageType, projectId: string, timestamp: string, id: string): Promise<PageData> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.copyToPins(projectId, timestamp, id);
}

export async function setZoneStatus(storageType: StorageType, projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    await crawlerProvider.setZoneStatus(projectId, timestamp, id, index, status);
    return getPages(storageType, projectId, timestamp);
}

export async function setZonesStatus(storageType: StorageType, projectId: string, timestamp: string, id: string, status: string): Promise<PageData[]> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    await crawlerProvider.setZonesStatus(projectId, timestamp, id, status);
    return getPages(storageType, projectId, timestamp);
}

export function setStatus(storageType: StorageType, projectId: string, timestamp: string, status: string): Promise<Crawler> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.setCrawlerStatus(projectId, timestamp, status);
}

export function startCrawler(storageType: StorageType, projectId: string): Promise<StartCrawler> {
    const crawlerProvider = new CrawlerProvider(storageType, this);
    return crawlerProvider.startCrawler(projectId);
}

export function startCrawlers(/* storageType: StorageType */): Promise<void> {
    const crawlerProvider = new CrawlerProvider(undefined, this);
    return crawlerProvider.startCrawlers();
}
