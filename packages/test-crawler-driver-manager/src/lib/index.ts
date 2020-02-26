import { warn, info } from 'logol';
import * as os from 'os';
import { join } from 'path';

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

export const defaultDestination = join(__dirname, '..', 'node_modules', '.bin');
export const defaultPlatform = os.platform() as Platform;
export const defaultArch = os.arch() as Arch;

export interface Options {
    platform?: Platform;
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
    x64 = 'x64',
    x32 = 'x32',
}

export async function driver(
    type: DriverType,
    options?: Options,
    destination: string = defaultDestination,
) {
    const opt = {
        platform: defaultPlatform,
        arch: defaultArch,
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
        return;
    }
    info('Setup driver done:', type);
}
