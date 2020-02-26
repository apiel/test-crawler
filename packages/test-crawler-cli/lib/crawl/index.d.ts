import { CrawlTarget } from 'test-crawler-core';
import { Push } from './pusher';
export declare function afterAll(totalDiff: number, totalError: number): Promise<void>;
export declare function crawl(crawlTarget?: CrawlTarget, push?: Push): Promise<void>;
