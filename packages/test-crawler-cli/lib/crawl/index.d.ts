import { CrawlTarget } from 'test-crawler-core';
export declare function afterAll(totalDiff: number, totalError: number): Promise<void>;
export declare function crawl(crawlTarget?: CrawlTarget, push?: (payload: any) => void): Promise<void>;
