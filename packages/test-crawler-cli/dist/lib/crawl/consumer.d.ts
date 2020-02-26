export interface PickerResponse {
    queue: QueueProps;
    data: any;
    apply: () => Promise<void>;
}
export interface Consumer {
    picker: () => Promise<PickerResponse | undefined>;
    runner: (data: any) => Promise<void>;
    finish?: () => any;
}
export interface QueueProps {
    name: string;
    maxConcurrent: number;
}
declare type Consumers = {
    [key: string]: Consumer;
};
export declare function setConsumers(_consumers: Consumers): void;
export declare function runConsumers(afterAll: ({}: {}) => void): Promise<void>;
export {};
