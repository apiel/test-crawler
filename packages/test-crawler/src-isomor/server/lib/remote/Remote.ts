import { CrawlTarget } from '../../typing';

export abstract class Remote {
    abstract read(path: string): Promise<Buffer>;
    abstract readJSON(path: string): Promise<any>;
    abstract readdir(path: string): Promise<string[]>;
    abstract saveJSON(file: string, data: any): Promise<void>;
    abstract saveFile(file: string, data: string): Promise<void>;
    abstract copy(src: string, dst: string): Promise<void>;
    abstract remove(file: string): Promise<void>;
    abstract crawl(crawlTarget?: CrawlTarget, consumeTimeout?: number, push?: (payload: any) => void): Promise<void>;
}
