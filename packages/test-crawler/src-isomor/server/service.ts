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
    RemoteType,
} from './typing';

const crawlerProvider = new CrawlerProvider();

// Force getSettings to be a async since crawlerProvider.getSettings is sync
export async function getSettings() {
    return crawlerProvider.getSettings();
}

export function loadProject(remoteType: RemoteType, projectId: string): Promise<Project> {
    return crawlerProvider.loadProject(remoteType, projectId);
}

export function loadProjects(): Promise<Projects> {
    return crawlerProvider.loadProjects();
}

export function saveProject(remoteType: RemoteType, crawlerInput: CrawlerInput, name: string, projectId?: string): Promise<Project> {
    return crawlerProvider.saveProject(remoteType, crawlerInput, name, projectId);
}

export function getCrawler(remoteType: RemoteType, projectId: string, timestamp: string): Promise<Crawler> {
    return crawlerProvider.getCrawler(remoteType, projectId, timestamp);
}

export function getCrawlers(remoteType: RemoteType, projectId: string): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers(remoteType, projectId);
}

export function getPages(remoteType: RemoteType, projectId: string, timestamp: string): Promise<PageData[]> {
    return crawlerProvider.getPages(remoteType, projectId, timestamp);
}

export function getPins(remoteType: RemoteType, projectId: string): Promise<PageData[]> {
    return crawlerProvider.getPins(remoteType, projectId);
}

export function getPin(remoteType: RemoteType, projectId: string, id: string): Promise<PageData> {
    return crawlerProvider.getPin(remoteType, projectId, id);
}

export function setCode(remoteType: RemoteType, projectId: string, code: Code): Promise<void> {
    return crawlerProvider.saveCode(remoteType, projectId, code);
}

export function getCode(remoteType: RemoteType, projectId: string, id: string): Promise<Code> {
    return crawlerProvider.loadCode(remoteType, projectId, id);
}

export function getCodes(remoteType: RemoteType, projectId: string): Promise<CodeInfoList> {
    return crawlerProvider.getCodeList(remoteType, projectId);
}

export async function getThumbnail(remoteType: RemoteType, projectId: string, folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(remoteType, projectId, folder, id);
    // const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    // return `data:image/png;base64, ${(await image.toBuffer()).toString('base64')}`;
    return `data:image/png;base64, ${(image).toString('base64')}`;
}

export function removePin(remoteType: RemoteType, projectId: string, id: string): Promise<PageData[]> {
    return crawlerProvider.removeFromPins(remoteType, projectId, id);
}

export function pin(remoteType: RemoteType, projectId: string, timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToPins(remoteType, projectId, timestamp, id);
}

export async function setZoneStatus(remoteType: RemoteType, projectId: string, timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(remoteType, projectId, timestamp, id, index, status);
    return getPages(remoteType, projectId, timestamp);
}

export async function setZonesStatus(remoteType: RemoteType, projectId: string, timestamp: string, id: string, status: string): Promise<PageData[]> {
    await crawlerProvider.setZonesStatus(remoteType, projectId, timestamp, id, status);
    return getPages(remoteType, projectId, timestamp);
}

export function setStatus(remoteType: RemoteType, projectId: string, timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(remoteType, projectId, timestamp, status);
}

export function startCrawler(remoteType: RemoteType, projectId: string): Promise<string> {
    const { push }: WsContext = this;
    return crawlerProvider.startCrawler(remoteType, projectId, push);
}

export function startCrawlers(/*remoteType: RemoteType*/): Promise<void> {
    const { push }: WsContext = this;
    return crawlerProvider.startCrawlers(push);
}
