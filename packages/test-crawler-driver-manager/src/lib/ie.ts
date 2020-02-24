import axios from 'axios';
import { join } from 'path';

import { Platform, Arch, Options } from '.';
import { downloadZip, mkdir } from './utils';

export const URL = 'https://selenium-release.storage.googleapis.com/3.9/IEDriverServer_%s_3.9.0.zip';

export async function getIedriver({
    platform,
    destination = process.cwd(),
    arch = Arch.x64,
}: Options) {
    const assetUrl = await getIeDownloadUrl(platform, arch);
    await mkdir(destination, { recursive: true });
    await downloadZip(assetUrl, destination);

    return {
        assetUrl,
        file: join(destination, 'IEDriverServer.exe'),
    };
}

export async function getIeDownloadUrl(
    platform: Platform,
    arch: Arch = Arch.x64,
) {

    const name = arch === Arch.x64 ? 'x64' : 'Win32';
    return URL.replace('%s', name);
}
