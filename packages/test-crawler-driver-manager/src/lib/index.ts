export { getChromedriver, getChromeDownloadUrl } from './chrome';
export { getGeckodriver, getGeckoDownloadUrl } from './gecko';
export { getIedriver, getIeDownloadUrl } from './ie';

export interface Options {
    platform: Platform;
    destination?: string;
    arch?: Arch;
}

export enum Platform {
    mac = 'darwin',
    linux = 'linux',
    win = 'win',
}

export enum Arch {
    x64 = '64',
    x32 = '32',
}
