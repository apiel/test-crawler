import { Crawler, Browser, Viewport } from 'test-crawler-core';
export declare function startBrowser(browser: Browser, viewport: Viewport, pngFile: string, htmlFile: string, crawler: Crawler, projectId: string, id: string, url: string): Promise<any>;
export declare function installDriver(browser: Browser): Promise<void>;
