// import { Zone } from 'pixdiff-zone';
// import { Viewport } from 'puppeteer';
// export { Viewport, Zone };

export interface Zone {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}

export interface Viewport {
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    isLandscape?: boolean;
}

export interface CodeInfoList {
    [id: string]: CodeInfo;
}

export interface CodeInfo {
    id: string;
    pattern: string;
    name: string;
}

export interface Code extends CodeInfo {
    source: string;
}

export interface CrawlerInput {
    url: string;
    viewport: Viewport;
    method: string;
    limit?: number;
    autopin: boolean;
}

// to remove?
export enum RemoteType {
    GitHub,
}

// to remove?
export interface RemoteGitHub {
    type: RemoteType.GitHub;
    user: string;
    repo: string;
    token: string;
    // gitBranch
    // gitFolder
}

export interface Project {
    id: string;
    name: string;
    crawlerInput: CrawlerInput;
    remote?: RemoteGitHub; // to remove?
}

export interface Crawler extends CrawlerInput {
    id: string;
    timestamp: string;
    diffZoneCount: number;
    errorCount: number;
    inQueue: number;
    urlsCount: number;
    status: string;
    startAt: number;
    lastUpdate: number;
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

export interface CrawlTarget {
    pagesFolder: string;
    projectId: string;
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
