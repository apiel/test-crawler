/// <reference types="node" />
import { writeFile, copyFile } from 'fs';
export declare const writeFileAsync: typeof writeFile.__promisify__;
export declare const copyFileAsync: typeof copyFile.__promisify__;
export declare function readJson(file: string): Promise<any>;
