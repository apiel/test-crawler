import * as config from './config';
export declare const getConfig: () => typeof config;
export interface CrawlerInput {
    url: string;
}
export interface Crawler extends CrawlerInput {
    id: string;
    timestamp: number;
}
export interface StartCrawler {
    crawler: Crawler;
    config: {
        MAX_HISTORY: number;
    };
}
export declare class CrawlerProvider {
    getAllCrawlers(): Promise<Crawler[]>;
    startCrawler(crawlerInput: CrawlerInput): Promise<StartCrawler>;
    private cleanHistory;
}
