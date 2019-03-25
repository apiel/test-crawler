export interface Crawler {
    url: string;
    timestamp: number;
}
export declare const getAllCrawlers: () => Promise<Crawler[]>;
