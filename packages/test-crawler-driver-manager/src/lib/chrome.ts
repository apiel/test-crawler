import axios from 'axios';

import { Platform, Arch, Options } from '.';
import { downloadZip, mkdir, getFile } from './utils';

export const URL = 'https://chromedriver.storage.googleapis.com';

export async function getChromedriver({
    platform,
    destination = process.cwd(),
    arch = Arch.x64,
}: Options) {
    const assetUrl = await getChromeDownloadUrl(platform, arch);
    await mkdir(destination, { recursive: true });
    await downloadZip(assetUrl, destination);

    return {
        assetUrl,
        file: getFile(platform, destination, 'chromedriver'),
    };
}

function getName(platform: Platform, arch: Arch = Arch.x64) {
    if (platform === Platform.mac) {
        return 'chromedriver_mac64';
    } else if (platform === Platform.win) {
        return 'chromedriver_win32';
    }
    return 'chromedriver_linux64';
}

export async function getChromeDownloadUrl(
    platform: Platform,
    arch: Arch = Arch.x64,
) {
    const { data: version } = await axios.get(`${URL}/LATEST_RELEASE`);
    const name = getName(platform, arch);
    return `${URL}/${version}/${name}.zip`;
}
