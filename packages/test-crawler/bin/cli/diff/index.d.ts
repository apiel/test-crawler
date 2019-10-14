import { Crawler } from '../../src-isomor/server/typing';
export declare function prepare(id: string, distFolder: string, crawler: Crawler): Promise<{
    diffZoneCount: number;
}>;
