import { CrawlTarget } from 'test-crawler-core';
export declare function setConsumerMaxCount({ projectId }: CrawlTarget): Promise<void>;
export declare function runQueuesConsumer(crawlTarget: CrawlTarget): Promise<void>;
export declare function isQueuesConsumerRunning(): boolean;
