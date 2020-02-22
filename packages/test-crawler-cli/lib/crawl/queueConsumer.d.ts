import { CrawlTarget } from 'test-crawler-core';
export declare function setConsumerMaxCount({ projectId }: CrawlTarget): Promise<void>;
export declare function initConsumeQueues(consumeTimeout: number, crawlTarget: CrawlTarget): Promise<void>;
