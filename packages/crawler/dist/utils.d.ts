import { PageData } from './typing';
export declare function getFolders(): Promise<string[]>;
export declare const getFilePath: (id: string, distFolder: string) => (extension: string) => string;
export declare function addToQueue(url: string, distFolder: string): Promise<boolean>;
export declare function getQueueFolder(distFolder: string): string;
export declare function saveData(file: string, pageData: PageData): Promise<void>;
