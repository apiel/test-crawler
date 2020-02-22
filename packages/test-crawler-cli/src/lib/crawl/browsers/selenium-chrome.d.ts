import { Crawler, Viewport } from '../../typing';
export declare function startSeleniumChrome(viewport: Viewport, pngFile: string, htmlFile: string, crawler: Crawler, projectId: string, id: string, url: string): Promise<{
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
