export { getChromedriver, getChromeDownloadUrl, downloadChrome } from './chrome';
export { getGeckodriver, getGeckoDownloadUrl } from './gecko';
export { getIedriver, getIeDownloadUrl, downloadIe } from './ie';
export interface Options {
    platform: Platform;
    destination?: string;
    arch?: Arch;
    force?: boolean;
}
export declare enum Platform {
    mac = "darwin",
    linux = "linux",
    win = "win"
}
export declare enum Arch {
    x64 = "64",
    x32 = "32"
}
