/// <reference types="node" />
import * as config from './config';
import { Crawler, CrawlerInput, StartCrawler, PageData } from './typing';
export { Crawler, CrawlerInput, StartCrawler, Navigation, PageData, Performance, Timing, Viewport, PngDiffData, Zone } from './typing';
export declare const getConfig: () => typeof config;
export declare class CrawlerProvider {
    private copyFile;
    copyToBase(timestamp: string, id: string): Promise<PageData>;
    image(timestamp: string, id: string): Promise<Buffer>;
    getPages(timestamp: string): Promise<PageData[]>;
    getCrawler(timestamp: string): Promise<Crawler>;
    getAllCrawlers(): Promise<Crawler[]>;
    startCrawler(crawlerInput: CrawlerInput): Promise<StartCrawler>;
    private cleanHistory;
}
