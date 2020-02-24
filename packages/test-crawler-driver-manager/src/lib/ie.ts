import { join } from 'path';
import * as os from 'os';

import { Platform, Arch, Options } from '.';
import {
    downloadZip,
    mkdir,
    getDriver,
} from './utils';

export const FILE = 'IEDriverServer.exe';
export const URL =
    'https://selenium-release.storage.googleapis.com/3.9/IEDriverServer_%s_3.9.0.zip';

export async function getIedriver({
    platform = os.platform() as Platform,
    destination = process.cwd(),
    arch = os.arch() as Arch,
    force = false,
}: Options) {
    const file = join(destination, 'IEDriverServer.exe');
    await getDriver({ platform, destination, arch, force }, file, downloadIe);
    return file;
}

export async function downloadIe(
    platform: Platform,
    arch: Arch,
    destination: string,
) {
    const assetUrl = await getIeDownloadUrl(platform, arch);
    await mkdir(destination, { recursive: true });
    await downloadZip(assetUrl, destination);

    return assetUrl;
}

export async function getIeDownloadUrl(
    platform: Platform,
    arch: Arch = Arch.x64,
) {
    const name = arch === Arch.x64 ? 'x64' : 'Win32';
    return URL.replace('%s', name);
}
