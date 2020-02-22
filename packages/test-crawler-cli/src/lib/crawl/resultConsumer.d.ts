interface ResultQueue {
    result?: {
        diffZoneCount: number;
    };
    projectId: string;
    timestamp: string;
    isError?: boolean;
}
export declare function pushToResultConsumer(resultQueue: ResultQueue): void;
export declare function initConsumeResults(consumeTimeout: number, push?: (payload: any) => void): Promise<void>;
export {};
