import { PageData, Viewport } from './typing';
export declare function getFolders(): Promise<string[]>;
export declare type FilePath = (extension: string) => string;
export declare const getFilePath: (id: string, distFolder: string) => FilePath;
export declare function addToQueue(url: string, viewport: Viewport, distFolder: string): Promise<boolean>;
export declare function getQueueFolder(distFolder: string): string;
export declare function savePageInfo(file: string, pageData: PageData): Promise<void>;
