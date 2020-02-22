declare type Page = any;
import { WebDriver } from 'selenium-webdriver';
import { Crawler } from 'test-crawler-core';
export declare function loadPage(projectId: string, id: string, url: string, timestamp: string, done: () => void, retry?: number): Promise<void>;
export declare function injectCodes(page: Page | WebDriver, projectId: string, id: string, url: string, links: string[], crawler: Crawler): Promise<string[]>;
export {};
