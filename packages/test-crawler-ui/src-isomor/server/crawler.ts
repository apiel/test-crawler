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
    return this.crawlerProvider.startCrawler(crawlerInput);
}

export function getCrawler(timestamp: string): Promise<Crawler> {
    return this.crawlerProvider.getCrawler(timestamp);
}

export function getPages(timestamp: string): Promise<PageData[]> {
    return this.crawlerProvider.getPages(timestamp);
}

export function getPins(): Promise<PageData[]> {
    return this.crawlerProvider.getBasePages();
}

export async function thumbnail(folder: string, id: string, width: number = 300): Promise<Buffer> {
    const image = await this.crawlerProvider.image(folder, id);
    return sharp(image).resize(width).toBuffer();
}

export function pin(timestamp: string, id: string): Promise<PageData> {
    return this.crawlerProvider.copyToBase(timestamp, id);
}

export function setZoneStatus(timestamp: string, id: string, index: number, status: string): Promise<PageData> {
    return this.crawlerProvider.setZoneStatus(timestamp, id, index, status);
}

export function setStatus(timestamp: string, status: string): Promise<Crawler> {
    return this.crawlerProvider.setCrawlerStatus(timestamp, status);
}