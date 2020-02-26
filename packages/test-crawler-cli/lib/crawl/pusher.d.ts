export declare type Push = (payload: any) => Promise<boolean>;
export declare function pushPush(push: Push): void;
export declare function sendPush(payload: any): Promise<void>;
