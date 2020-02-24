import { warn } from 'logol';
import { cwd } from 'process';
import * as os from 'os';

import { getChromedriver } from './chrome';
import { getGeckodriver } from './gecko';
import { getIedriver } from './ie';

export {
    getChromedriver,
    getChromeDownloadUrl,
    downloadChrome,
} from './chrome';
export { getGeckodriver, getGeckoDownloadUrl, downloadGecko } from './gecko';
export { getIedriver, getIeDownloadUrl, downloadIe } from './ie';

export interface Options {
    platform: Platform;
    destination?: string;
    arch?: Arch;
    force?: boolean;
}

export enum DriverType {
    Gecko = 'Gecko',
    Chrome = 'Chrome',
    IE = 'IE',
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

export async function driver(
    type: DriverType,
    options: Options,
    destination: string = cwd(),
) {
    const opt = {
        platform: os.platform(),
        arch: os.arch() as Arch,
        destination,
        ...options,
    };
    if (type === DriverType.Chrome) {
        await getChromedriver(opt);
    } else if (type === DriverType.Gecko) {
        await getGeckodriver(opt);
    } else if (type === DriverType.IE) {
        await getIedriver(opt);
    } else {
        warn('Unknown driver', type);
    }
}
