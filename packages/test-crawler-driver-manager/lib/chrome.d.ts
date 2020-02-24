import { Platform, Arch, Options } from '.';
export declare const FILE = "chromedriver";
export declare const URL = "https://chromedriver.storage.googleapis.com";
export declare function getChromedriver({ platform, destination, arch, force, }: Options): Promise<string>;
export declare function downloadChrome(platform: Platform, arch: Arch, destination: string): Promise<string>;
export declare function getChromeDownloadUrl(platform: Platform, arch?: Arch): Promise<string>;
