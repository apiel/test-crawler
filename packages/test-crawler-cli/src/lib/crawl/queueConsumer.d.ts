import { CrawlTarget } from '../typing';
export declare function setConsumerMaxCount({ projectId }: CrawlTarget): Promise<void>;
export declare function initConsumeQueues(consumeTimeout: number, crawlTarget: CrawlTarget): Promise<void>;
