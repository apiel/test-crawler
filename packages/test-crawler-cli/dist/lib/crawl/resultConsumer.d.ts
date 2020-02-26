import { Consumer } from './consumer';
interface ResultQueue {
    result?: {
        diffZoneCount: number;
    };
    projectId: string;
    timestamp: string;
    isError?: boolean;
}
export declare function pushToResultConsumer(resultQueue: ResultQueue): void;
export declare const consumer: Consumer;
export {};
