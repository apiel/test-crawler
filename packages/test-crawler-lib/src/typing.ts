import { Zone } from 'pixdiff-zone';
import { Viewport } from 'puppeteer';

export { Viewport, Zone };

export interface CrawlerInput {
    url: string;
    viewport: Viewport;
    method: string;
    limit?: number;
    autopin: boolean;
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
    error?: string;
    performance?: Performance;
    metrics?: PageMetrics;
    viewport?: Viewport;
    baseUrl?: string;

    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export interface PageMetrics {
    Timestamp: number;
    Documents: number;
    Frames: number;
    JSEventListeners: number;
    Nodes: number;
    LayoutCount: number;
    RecalcStyleCount: number;
    LayoutDuration: number;
    RecalcStyleDuration: number;
    ScriptDuration: number;
    TaskDuration: number;
    JSHeapUsedSize: number;
    JSHeapTotalSize: number;
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
