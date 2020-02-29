export declare type Push = (payload: any) => Promise<void>;
export declare function pushPush(push: Push): void;
export declare function sendPush(payload: any): Promise<void>;
