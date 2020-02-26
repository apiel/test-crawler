import { CrawlTarget, Browser } from 'test-crawler-core';
import { Push } from 'test-crawler-cli';

import { Job } from '../../typing';

export abstract class Storage {
    abstract get browsers(): Browser[];
    abstract info(): Promise<string | undefined>;
    abstract image(path: string): Promise<Buffer | string | undefined>;
    abstract blob(path: string): Promise<Buffer | undefined>;
    abstract repos(): Promise<string[] | undefined>;
    abstract getRepo(): Promise<string | undefined>;
    abstract read(path: string): Promise<Buffer>;
    abstract readJSON(path: string): Promise<any>;
    abstract readdir(path: string): Promise<string[]>;
    abstract saveJSON(file: string, data: any): Promise<void>;
    abstract saveFile(file: string, data: string): Promise<void>;
    abstract copy(src: string, dst: string): Promise<void>;
    abstract copyBlob(src: string, dst: string): Promise<void>;
    abstract remove(file: string): Promise<void>;
    abstract crawl(
        crawlTarget?: CrawlTarget,
        push?: Push,
        browser?: Browser,
    ): Promise<undefined | string>;
    abstract jobs(projectId: string): Promise<Job[]>;
}
