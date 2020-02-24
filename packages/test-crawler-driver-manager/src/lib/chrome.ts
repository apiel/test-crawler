import axios from 'axios';
import * as os from 'os';

import { Platform, Arch, Options } from '.';
import {
    downloadZip,
    mkdir,
    getFile,
    getDriver,
} from './utils';

export const FILE = 'chromedriver';
export const URL = 'https://chromedriver.storage.googleapis.com';

export async function getChromedriver({
    platform = os.platform() as Platform,
    destination = process.cwd(),
    arch = os.arch() as Arch,
    force = false,
}: Options) {
    const file = getFile(platform, destination, FILE);
    await getDriver(
        { platform, destination, arch, force },
        file,
        downloadChrome,
    );
    return file;
}

export async function downloadChrome(
    platform: Platform,
    arch: Arch,
    destination: string,
) {
    const assetUrl = await getChromeDownloadUrl(platform, arch);
    await mkdir(destination, { recursive: true });
    await downloadZip(assetUrl, destination);

    return assetUrl;
}

export async function getChromeDownloadUrl(
    platform: Platform,
    arch: Arch = Arch.x64,
) {
    const { data: version } = await axios.get(`${URL}/LATEST_RELEASE`);
    const name = getName(platform, arch);
    return `${URL}/${version}/${name}.zip`;
}

function getName(platform: Platform, arch: Arch = Arch.x64) {
    if (platform === Platform.mac) {
        return 'chromedriver_mac64';
    } else if (platform === Platform.win) {
        return 'chromedriver_win32';
    }
    return 'chromedriver_linux64';
}
