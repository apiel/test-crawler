import { Platform, Arch, Options } from '.';
export declare const FILE = "geckodriver";
export declare const URL = "https://api.github.com/repos/mozilla/geckodriver/releases/latest";
export declare function getGeckodriver({ platform, destination, arch, force, }: Options): Promise<string>;
export declare function downloadGecko(platform: Platform, arch: Arch, destination: string): Promise<any>;
export declare function getGeckoDownloadUrl(platform: Platform, arch?: Arch): Promise<any>;
