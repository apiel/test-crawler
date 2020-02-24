import axios from 'axios';
import { extname, join } from 'path';

import { Platform, Arch } from '.';
import { downloadTar, downloadZip } from './utils';

export const URL =
    'https://api.github.com/repos/mozilla/geckodriver/releases/latest';

export async function getGeckodriver(
    platform: Platform,
    arch: Arch = Arch.x64,
) {
    const assetUrl = await getGeckoDownloadUrl(platform, arch);
    const dstFolder = join(__dirname, 'drivers');
    console.log('assetUrl', assetUrl);
    if (extname(assetUrl) === '.zip') {
        downloadZip(assetUrl, dstFolder);
    } else {
        downloadTar(assetUrl, dstFolder);
    }

    return {
        assetUrl,
        file: join(dstFolder, platform === Platform.win ? 'geckodriver.exe' : 'geckodriver')
    }
}

function getName(platform: Platform, arch: Arch = Arch.x64) {
    if (platform === Platform.mac) {
        return 'macos';
    }
    return `${platform}${arch}`;
}

export async function getGeckoDownloadUrl(
    platform: Platform,
    arch: Arch = Arch.x64,
) {
    const assets = await getAssets();
    const name = getName(platform, arch);
    const asset = assets.find((asset: any) => asset.name.includes(name));

    return asset?.browser_download_url;
}

let cacheAssets: any;
async function getAssets() {
    if (!cacheAssets) {
        const {
            data: { assets },
        } = await axios.get(URL);
        cacheAssets = assets;
    }
    return cacheAssets;
}
