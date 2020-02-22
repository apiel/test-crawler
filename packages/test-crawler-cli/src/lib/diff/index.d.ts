import { Crawler } from '../typing';
export declare function prepare(projectId: string, timestamp: string, id: string, crawler: Crawler): Promise<{
    diffZoneCount: number;
}>;
