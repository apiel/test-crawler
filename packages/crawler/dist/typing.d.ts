import { Zone } from 'pixdiff';
export interface CrawlerInput {
    url: string;
}
export interface Crawler extends CrawlerInput {
    id: string;
    timestamp: number;
}
export interface StartCrawler {
    crawler: Crawler;
    config: {
        MAX_HISTORY: number;
    };
}
export interface PageData {
    id: string;
    url: string;
    performance?: Performance;
    pixelDiffRatio?: number;
    pngDiffZone?: Zone[];
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
