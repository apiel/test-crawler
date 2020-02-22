import { CrawlTarget, Viewport } from '../typing';
export declare function startCrawler({ projectId, timestamp }: CrawlTarget): Promise<void>;
export declare function addToQueue(url: string, viewport: Viewport, projectId: string, timestamp: string, limit?: number): Promise<boolean>;
