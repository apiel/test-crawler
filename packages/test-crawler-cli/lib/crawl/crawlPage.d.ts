import { Page } from 'puppeteer';
import { WebDriver } from 'selenium-webdriver';
import { Crawler } from '../typing';
export declare function loadPage(projectId: string, id: string, url: string, timestamp: string, done: () => void, retry?: number): Promise<void>;
export declare function injectCodes(page: Page | WebDriver, projectId: string, id: string, url: string, links: string[], crawler: Crawler): Promise<string[]>;
