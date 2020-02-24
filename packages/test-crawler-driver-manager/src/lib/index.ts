export { getChromedriver } from './chrome';
export { getGeckodriver, getGeckoDownloadUrl } from './gecko';

export enum Platform {
    mac = 'darwin',
    linux = 'linux',
    win = 'win',
}

export enum Arch {
    x64 = '64',
    x32 = '32',
}
