// import * as sharp from 'sharp';

import { WsContext } from 'isomor-server';

import {
    CrawlerProvider,
    CrawlerLocalProvider,
    CrawlerGitProvider,
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

const crawlerProvider = new CrawlerProvider();

// Force getSettings to be a async since crawlerProvider.getSettings is sync
export async function getSettings() {
    return crawlerProvider.getSettings();
}

export function loadProject(projectId: string): Promise<Project> {
    return crawlerProvider.loadProject(projectId);
}

export function loadProjects(): Promise<Project[]> {
    return crawlerProvider.loadProjects();
}

export function saveProject(crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
    return crawlerProvider.saveProject(crawlerInput, name, projectId);
}

export function getCrawler(projectId: string, timestamp: string): Promise<Crawler> {
    return crawlerProvider.getCrawler(projectId, timestamp);
}

export function getCrawlers(projectId: string): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers(projectId);
}

export function getPages(projectId: string, timestamp: string): Promise<PageData[]> {
    return crawlerProvider.getPages(projectId, timestamp);
}

export function getPins(projectId: string): Promise<PageData[]> {
    return crawlerProvider.getPins(projectId);
}

export function getPin(projectId: string, id: string): Promise<PageData> {
    return crawlerProvider.getPin(projectId, id);
}

export function setCode(projectId: string, code: Code): Promise<void> {
    return crawlerProvider.saveCode(projectId, code);
}

export function getCode(projectId: string, id: string): Promise<Code> {
    return crawlerProvider.loadCode(projectId, id);
}

export function getCodes(projectId: string): Promise<CodeInfoList> {
    return crawlerProvider.getCodeList(projectId);
}

export async function getThumbnail(projectId: string, folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(projectId, folder, id);
    // const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    // return `data:image/png;base64, ${(await image.toBuffer()).toString('base64')}`;
    return `data:image/png;base64, ${(image).toString('base64')}`;
}

export function removePin(projectId: string, id: string): Promise<PageData[]> {
    return crawlerProvider.removeFromPins(projectId, id);
}

export function pin(projectId: string, timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToPins(projectId, timestamp, id);
}

export async function setZoneStatus(projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(projectId, timestamp, id, index, status);
    return getPages(projectId, timestamp);
}

export async function setZonesStatus(projectId: string, timestamp: string, id: string, status: string): Promise<PageData[]> {
    await crawlerProvider.setZonesStatus(projectId, timestamp, id, status);
    return getPages(projectId, timestamp);
}

export function setStatus(projectId: string, timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(projectId, timestamp, status);
}

export function startCrawlerFromProject(projectId: string): Promise<StartCrawler> {
    const { push }: WsContext = this;
    return crawlerProvider.startCrawlerFromProject(projectId, push);
}

export function startCrawlers(): Promise<void> {
    const { push }: WsContext = this;
    return crawlerProvider.startCrawlers(push);
}
