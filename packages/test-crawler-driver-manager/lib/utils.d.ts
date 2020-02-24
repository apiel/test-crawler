/// <reference types="node" />
import * as fs from 'fs';
import { Platform, Arch, Options } from '.';
export declare const mkdir: typeof fs.mkdir.__promisify__;
export declare function downloadZip(url: string, destination: string): Promise<void>;
export declare function downloadTar(url: string, destination: string): Promise<unknown>;
export declare function getFile(platform: Platform, destination: string, name: string): string;
export declare function writeFileInfo(file: string, platform: Platform, arch: Arch, assetUrl: string): Promise<void>;
export declare function checkDriverPresent(file: string, platform: Platform, arch: Arch): Promise<boolean>;
export declare function getDriver({ platform, destination, arch, force, }: Options, file: string, fn: (platform: Platform, arch: Arch, destination: string) => Promise<string>): Promise<string>;
