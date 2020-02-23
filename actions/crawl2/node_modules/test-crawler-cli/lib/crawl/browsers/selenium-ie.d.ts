import { Crawler, Viewport } from 'test-crawler-core';
export declare function startSeleniumIE(viewport: Viewport, pngFile: string, htmlFile: string, crawler: Crawler, projectId: string, id: string, url: string): Promise<{
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
