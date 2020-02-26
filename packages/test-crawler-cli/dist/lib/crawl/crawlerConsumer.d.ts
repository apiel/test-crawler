import { Consumer } from './consumer';
export declare const consumer: Consumer;
export declare function pushToCrawl(url: string, projectId: string, timestamp: string, limit?: number): Promise<boolean>;
