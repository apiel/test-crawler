import { Crawler } from 'test-crawler-lib/lib/typing';
export declare function prepare(id: string, distFolder: string, crawler: Crawler): Promise<{
    diffZoneCount: number;
}>;