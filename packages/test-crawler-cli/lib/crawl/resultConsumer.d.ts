interface ResultQueue {
    result?: {
        diffZoneCount: number;
    };
    projectId: string;
    timestamp: string;
    isError?: boolean;
}
export declare function pushToResultConsumer(resultQueue: ResultQueue, push?: (payload: any) => void): void;
export declare function runResultsConsumer(push?: (payload: any) => void): void;
export {};
