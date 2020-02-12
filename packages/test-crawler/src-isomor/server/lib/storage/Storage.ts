import { CrawlTarget, Job } from '../../typing';

export abstract class Storage {
    abstract info(): Promise<string | undefined>;
    abstract blob(path: string): Promise<Buffer | undefined>;
    abstract repos(): Promise<string[] | undefined>;
    abstract getRepo(): Promise<string | undefined>;
    abstract read(path: string): Promise<Buffer>;
    abstract readJSON(path: string): Promise<any>;
    abstract readdir(path: string): Promise<string[]>;
    abstract saveJSON(file: string, data: any): Promise<void>;
    abstract saveFile(file: string, data: string): Promise<void>;
    abstract copy(src: string, dst: string): Promise<void>;
    abstract remove(file: string): Promise<void>;
    abstract crawl(crawlTarget?: CrawlTarget, consumeTimeout?: number, push?: (payload: any) => void): Promise<undefined | string>;
    abstract jobs(projectId: string): Promise<Job[]>;
}
