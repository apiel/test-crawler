import {
    CrawlerProvider,
    Crawler,
    CrawlerInput,
    StartCrawler,
    PageData,
} from 'test-crawler-lib';
import * as sharp from 'sharp';

const crawlerProvider = new CrawlerProvider()

export function getCrawlers(): Promise<Crawler[]> {
    return crawlerProvider.getAllCrawlers();
}

export function startCrawler(crawlerInput: CrawlerInput): Promise<StartCrawler> {
    return crawlerProvider.startCrawler(crawlerInput);
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

export async function getThumbnail(folder: string, id: string, width: number = 300): Promise<string> {
    const image = await crawlerProvider.image(folder, id);
    return `data:image/png;base64, `
        + (await sharp(image).resize(width).toBuffer()).toString('base64');
}

export function pin(timestamp: string, id: string): Promise<PageData> {
    return crawlerProvider.copyToBase(timestamp, id);
}

export async function setZoneStatus(timestamp: string, id: string, index: number, status: string): Promise<PageData[]> {
    await crawlerProvider.setZoneStatus(timestamp, id, index, status);
    return getPages(timestamp);
}

export async function setZonesStatus(timestamp: string, id: string, status: string): Promise<PageData[]> {
    const pages = await getPages(timestamp);
    const pageIndex = pages.findIndex(page => page.id === id);
    const page = pages[pageIndex];
    let newPage: PageData;
    for(let index = 0; index < page.png.diff.zones.length; index++) {
        newPage = await crawlerProvider.setZoneStatus(timestamp, id, index, status);
    }
    pages[pageIndex] = newPage;
    return pages;
}

export function setStatus(timestamp: string, status: string): Promise<Crawler> {
    return crawlerProvider.setCrawlerStatus(timestamp, status);
}