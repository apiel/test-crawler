// import * as sharp from 'sharp';

import {
    CrawlerProvider,
} from './lib';

import {
    Crawler,
    CrawlerInput,
    StartCrawler,
    PageData,
    Project,
    Code,
    CodeInfoList,
} from './typing';

const crawlerProvider = new CrawlerProvider()

export async function getSettings() {
    return crawlerProvider.getSettings();
}

export function getCrawlers(projectId: string): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers(projectId);
}

export function loadProject(projectId: string): Promise<Project> {
    return crawlerProvider.loadProject(projectId);
}

export function loadProjects(): Promise<Project[]> {
    return crawlerProvider.loadProjects();
}

export function saveProject(crawlerInput: CrawlerInput, name: string, id?: string): Promise<Project> {
    return crawlerProvider.saveProject(crawlerInput, name, id);
}

export function getCrawler(projectId: string, timestamp: string): Promise<Crawler> {
    return crawlerProvider.getCrawler(projectId, timestamp);
}

export function getPages(projectId: string, timestamp: string): Promise<PageData[]> {
    return crawlerProvider.getPages(projectId, timestamp);
}

export function getPins(): Promise<PageData[]> {
    return crawlerProvider.getBasePages();
}

export function getPin(id: string): Promise<PageData> {
    return crawlerProvider.getBasePage(id);
}

export function setCode(code: Code): Promise<void> {
    return crawlerProvider.saveCode(code);
}

export function getCode(id: string): Promise<Code> {
    return crawlerProvider.loadCode(id);
}

export function getCodes(): Promise<CodeInfoList> {
    return crawlerProvider.getCodeList();
}

export async function getThumbnail(projectId: string, folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(projectId, folder, id);
    // const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    // return `data:image/png;base64, ${(await image.toBuffer()).toString('base64')}`;
    return `data:image/png;base64, ${(image).toString('base64')}`;
}

export function pin(timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToBase(timestamp, id);
}

export async function setZoneStatus(projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(timestamp, id, index, status);
    return getPages(projectId, timestamp);
}

export async function setZonesStatus(projectId: string, timestamp: string, id: string, status: string): Promise<PageData[]> {
    await crawlerProvider.setZonesStatus(timestamp, id, status);
    return getPages(projectId, timestamp);
}

export function setStatus(timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(timestamp, status);
}

export function startCrawlerFromProject(projectId: string): Promise<StartCrawler> {
    return crawlerProvider.startCrawlerFromProject(projectId);
}

export function startCrawlers(): Promise<void> {
    return crawlerProvider.startCrawlers();
}
