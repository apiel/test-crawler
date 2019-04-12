/// <reference types="node" />
import * as config from './config';
import { Crawler, CrawlerInput, StartCrawler, PageData } from './typing';
export { Crawler, CrawlerInput, StartCrawler, Navigation, PageData, Performance, Timing, Viewport, PngDiffData, PngDiffDataZone, Zone, } from './typing';
export declare const getConfig: () => typeof config;
export declare class CrawlerProvider {
    private copyFile;
    setZoneStatus(timestamp: string, id: string, index: number, status: string): Promise<PageData>;
    setZonesStatus(timestamp: string, id: string, status: string): Promise<PageData>;
    copyToBase(timestamp: string, id: string): Promise<PageData>;
    image(folder: string, id: string): Promise<Buffer>;
    getBasePages(): Promise<PageData[]>;
    getPages(timestamp: string): Promise<PageData[]>;
    private getPagesInFolder;
    setCrawlerStatus(timestamp: string, status: string): Promise<Crawler>;
    getCrawler(timestamp: string): Promise<Crawler>;
    getAllCrawlers(): Promise<Crawler[]>;
    startCrawler(crawlerInput: CrawlerInput): Promise<StartCrawler>;
    private cleanHistory;
}
