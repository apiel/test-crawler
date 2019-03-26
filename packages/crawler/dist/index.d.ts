export interface Crawler {
    url: string;
    timestamp: number;
}
export declare class CrawlerProvider {
    getAllCrawlers(): Promise<Crawler[]>;
}
