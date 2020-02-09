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
} from './typing';
import { StorageType } from './storage.typing';

const crawlerProvider = new CrawlerProvider();

// Force getSettings to be a async since crawlerProvider.getSettings is sync
export async function getSettings() {
    return crawlerProvider.getSettings();
}

export function getRepo(storageType: StorageType) {
    return crawlerProvider.repo(storageType);
}

export function loadRepos(storageType: StorageType) {
    return crawlerProvider.repos(storageType);
}

export function loadProject(storageType: StorageType, projectId: string): Promise<Project> {
    return crawlerProvider.loadProject(storageType, projectId);
}

export function loadProjects(storageType: StorageType): Promise<Project[]> {
    return crawlerProvider.loadProjects(storageType);
}

export function saveProject(storageType: StorageType, crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
    return crawlerProvider.saveProject(storageType, crawlerInput, name, projectId);
}

export function getCrawler(storageType: StorageType, projectId: string, timestamp: string): Promise<Crawler> {
    return crawlerProvider.getCrawler(storageType, projectId, timestamp);
}

export function getCrawlers(storageType: StorageType, projectId: string): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers(storageType, projectId);
}

export function getPages(storageType: StorageType, projectId: string, timestamp: string): Promise<PageData[]> {
    return crawlerProvider.getPages(storageType, projectId, timestamp);
}

export function getPins(storageType: StorageType, projectId: string): Promise<PageData[]> {
    return crawlerProvider.getPins(storageType, projectId);
}

export function getPin(storageType: StorageType, projectId: string, id: string): Promise<PageData> {
    return crawlerProvider.getPin(storageType, projectId, id);
}

export function setCode(storageType: StorageType, projectId: string, code: Code): Promise<void> {
    return crawlerProvider.saveCode(storageType, projectId, code);
}

export function getCode(storageType: StorageType, projectId: string, id: string): Promise<Code> {
    return crawlerProvider.loadCode(storageType, projectId, id);
}

export function getCodes(storageType: StorageType, projectId: string): Promise<CodeInfoList> {
    return crawlerProvider.getCodeList(storageType, projectId);
}

export async function getThumbnail(storageType: StorageType, projectId: string, folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(storageType, projectId, folder, id);
    if (!image) {
        throw new Error('Cannot load image.');
    }
    // const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    // return `data:image/png;base64, ${(await image.toBuffer()).toString('base64')}`;
    return `data:image/png;base64, ${(image).toString('base64')}`;
}

export function removePin(storageType: StorageType, projectId: string, id: string): Promise<PageData[]> {
    return crawlerProvider.removeFromPins(storageType, projectId, id);
}

export function pin(storageType: StorageType, projectId: string, timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToPins(storageType, projectId, timestamp, id);
}

export async function setZoneStatus(storageType: StorageType, projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(storageType, projectId, timestamp, id, index, status);
    return getPages(storageType, projectId, timestamp);
}

export async function setZonesStatus(storageType: StorageType, projectId: string, timestamp: string, id: string, status: string): Promise<PageData[]> {
    await crawlerProvider.setZonesStatus(storageType, projectId, timestamp, id, status);
    return getPages(storageType, projectId, timestamp);
}

export function setStatus(storageType: StorageType, projectId: string, timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(storageType, projectId, timestamp, status);
}

export function startCrawler(storageType: StorageType, projectId: string): Promise<string> {
    return crawlerProvider.startCrawler(storageType, projectId, this?.push);
}

export function startCrawlers(/*storageType: StorageType*/): Promise<void> {
    return crawlerProvider.startCrawlers(this?.push);
}
