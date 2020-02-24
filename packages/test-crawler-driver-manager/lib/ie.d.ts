import { Platform, Arch, Options } from '.';
export declare const FILE = "IEDriverServer.exe";
export declare const URL = "https://selenium-release.storage.googleapis.com/3.9/IEDriverServer_%s_3.9.0.zip";
export declare function getIedriver({ platform, destination, arch, force, }: Options): Promise<string>;
export declare function downloadIe(platform: Platform, arch: Arch, destination: string): Promise<string>;
export declare function getIeDownloadUrl(platform: Platform, arch?: Arch): Promise<string>;
