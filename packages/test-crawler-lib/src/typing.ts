import { Zone } from 'pixdiff-zone';
import { Viewport } from 'puppeteer';

export { Viewport, Zone };

export interface CrawlerInput {
    url: string;
    viewport: Viewport;
    method: string;
}

export interface Preset {
    id: string;
    name: string;
    crawlerInput: CrawlerInput;
}

export interface Crawler extends CrawlerInput {
    id: string;
    timestamp: number;
    diffZoneCount: number;
    errorCount: number;
    inQueue: number;
    urlsCount: number;
    status: string;
    startAt: number;
    lastUpdate: number;
}

export interface StartCrawler {
    crawler: Crawler;
    config: {
        MAX_HISTORY: number;
    };
}

export interface PngDiffDataZone {
    zone: Zone;
    status: string;
}

export interface PngDiffData {
    pixelDiffRatio: number;
    zones: PngDiffDataZone[];
}

export interface PageData {
    id: string;
    url: string;
    performance?: Performance;
    viewport?: Viewport;
    baseUrl?: string;

    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export interface Performance {
    timeOrigin: number;
    timing: Timing;
    navigation: Navigation;
}

export interface Navigation {
    type: 0;
    redirectCount: 0;
}

export interface Timing {
    navigationStart: number;
    unloadEventStart: number;
    unloadEventEnd: number;
    redirectStart: number;
    redirectEnd: number;
    fetchStart: number;
    domainLookupStart: number;
    domainLookupEnd: number;
    connectStart: number;
    connectEnd: number;
    secureConnectionStart: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    domLoading: number;
    domInteractive: number;
    domContentLoadedEventStart: number;
    domContentLoadedEventEnd: number;
    domComplete: number;
    loadEventStart: number;
    loadEventEnd: number;
}
