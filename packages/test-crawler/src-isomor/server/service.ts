// import * as sharp from 'sharp';

import { WsContext } from 'isomor-server';

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
    Projects,
} from './typing';

const crawlerProvider = new CrawlerProvider();

// Force getSettings to be a async since crawlerProvider.getSettings is sync
export async function getSettings() {
    return crawlerProvider.getSettings();
}

export function loadProject(projectId: string): Promise<Project> {
    return crawlerProvider.loadProject(projectId);
}

export function loadProjects(): Promise<Projects> {
    return crawlerProvider.loadProjects();
}

export function saveProject(crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
    return crawlerProvider.saveProject(crawlerInput, name, projectId);
}

export function getCrawler(remoteType: string, projectId: string, timestamp: string): Promise<Crawler> {
    return crawlerProvider.getCrawler(projectId, timestamp);
}

export function getCrawlers(remoteType: string, projectId: string): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers(projectId);
}

export function getPages(remoteType: string, projectId: string, timestamp: string): Promise<PageData[]> {
    return crawlerProvider.getPages(projectId, timestamp);
}

export function getPins(remoteType: string, projectId: string): Promise<PageData[]> {
    return crawlerProvider.getPins(projectId);
}

export function getPin(remoteType: string, projectId: string, id: string): Promise<PageData> {
    return crawlerProvider.getPin(projectId, id);
}

export function setCode(remoteType: string, projectId: string, code: Code): Promise<void> {
    return crawlerProvider.saveCode(projectId, code);
}

export function getCode(remoteType: string, projectId: string, id: string): Promise<Code> {
    return crawlerProvider.loadCode(projectId, id);
}

export function getCodes(remoteType: string, projectId: string): Promise<CodeInfoList> {
    return crawlerProvider.getCodeList(projectId);
}

export async function getThumbnail(remoteType: string, projectId: string, folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(projectId, folder, id);
    // const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    // return `data:image/png;base64, ${(await image.toBuffer()).toString('base64')}`;
    return `data:image/png;base64, ${(image).toString('base64')}`;
}

export function removePin(remoteType: string, projectId: string, id: string): Promise<PageData[]> {
    return crawlerProvider.removeFromPins(projectId, id);
}

export function pin(remoteType: string, projectId: string, timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToPins(projectId, timestamp, id);
}

export async function setZoneStatus(remoteType: string, projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(projectId, timestamp, id, index, status);
    return getPages(remoteType, projectId, timestamp);
}

export async function setZonesStatus(remoteType: string, projectId: string, timestamp: string, id: string, status: string): Promise<PageData[]> {
    await crawlerProvider.setZonesStatus(projectId, timestamp, id, status);
    return getPages(remoteType, projectId, timestamp);
}

export function setStatus(remoteType: string, projectId: string, timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(projectId, timestamp, status);
}

export function startCrawler(remoteType: string, projectId: string): Promise<string> {
    const { push }: WsContext = this;
    return crawlerProvider.startCrawler(projectId, push);
}

export function startCrawlers(/*remoteType: string*/): Promise<void> {
    const { push }: WsContext = this;
    return crawlerProvider.startCrawlers(push);
}
