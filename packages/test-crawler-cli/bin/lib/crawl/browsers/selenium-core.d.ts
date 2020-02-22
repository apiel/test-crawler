import { WebDriver } from 'selenium-webdriver';
import { Crawler, Viewport } from '../../typing';
export declare function startSeleniumCore(driver: WebDriver, viewport: Viewport, pngFile: string, htmlFile: string, crawler: Crawler, projectId: string, id: string, url: string): Promise<{
    links: string[];
    url: string;
    id: string;
    performance: unknown;
    png: {
        width: number;
    };
    viewport: Viewport;
    error: string;
}>;
export declare function getScrollHeightCore(driver: WebDriver, url: string): Promise<number>;
