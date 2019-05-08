import { PageData, Viewport, CodeInfoList } from './typing';
export declare function getFolders(): Promise<string[]>;
export declare type FilePath = (extension: string) => string;
export declare const getFilePath: (id: string, distFolder: string) => FilePath;
export declare function addToQueue(url: string, viewport: Viewport, distFolder: string, limit?: number): Promise<boolean>;
export declare function getQueueFolder(distFolder: string): string;
export declare function savePageInfo(file: string, pageData: PageData): Promise<void>;
export declare function getCodeList(): Promise<CodeInfoList>;
