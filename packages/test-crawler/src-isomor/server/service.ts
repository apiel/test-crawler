import * as sharp from 'sharp';

import {
    CrawlerProvider,
} from './lib';

import {
    Crawler,
    CrawlerInput,
    StartCrawler,
    PageData,
    Preset,
    Code,
    CodeInfoList,
} from './typing';

const crawlerProvider = new CrawlerProvider()

export async function getSettings() {
    return crawlerProvider.getSettings();
}

export async function getLogs(): Promise<string> {
    return (await crawlerProvider.getLogs()).toString();
}

export function getCrawlers(): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers();
}

export function loadPresets(): Promise<Preset[]> {
    return crawlerProvider.loadPresets();
}

export function saveAndStart(crawlerInput: CrawlerInput, saveAs: string): Promise<StartCrawler> {
    return crawlerProvider.saveAndStart(crawlerInput, saveAs);
}

export function getCrawler(timestamp: string): Promise<Crawler> {
    return crawlerProvider.getCrawler(timestamp);
}

export function getPages(timestamp: string): Promise<PageData[]> {
    return crawlerProvider.getPages(timestamp);
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

export async function getThumbnail(folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(folder, id);
    const sharpImg = width ? sharp(image).resize(width) : sharp(image);
    return `data:image/png;base64, ${(await sharpImg.toBuffer()).toString('base64')}`;
}

export function pin(timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToBase(timestamp, id);
}

export async function setZoneStatus(timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(timestamp, id, index, status);
    return getPages(timestamp);
}

export async function setZonesStatus(timestamp: string, id: string, status: string): Promise<PageData[]> {
    await crawlerProvider.setZonesStatus(timestamp, id, status);
    return getPages(timestamp);
}

export function setStatus(timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(timestamp, status);
}