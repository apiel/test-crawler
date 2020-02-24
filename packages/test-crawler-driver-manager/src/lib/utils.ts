import * as AdmZip from 'adm-zip';
import axios from 'axios';
import { extract } from 'tar';
import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

import { Platform, Arch, Options } from '.';
import { info } from 'logol';

export const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

export async function downloadZip(url: string, destination: string) {
    const { data } = await axios.get(url, {
        responseType: 'arraybuffer',
    });
    const admZip = new AdmZip(data);
    return admZip.extractAllTo(destination, true);
}

export async function downloadTar(url: string, destination: string) {
    const response = await axios.get(url, {
        responseType: 'stream',
    });
    response.data.pipe(extract({ cwd: destination }));

    return new Promise((resolve, reject) => {
        response.data.on('finish', resolve);
        response.data.on('error', reject);
    });
}

export function getFile(platform: Platform, destination: string, name: string) {
    return join(destination, platform === Platform.win ? `${name}.exe` : name);
}

export function writeFileInfo(
    file: string,
    platform: Platform,
    arch: Arch,
    assetUrl: string,
) {
    const infoFile = `${file}.txt`;
    return writeFile(
        infoFile,
        JSON.stringify({ platform, arch, assetUrl }, null, 4),
    );
}

export async function checkDriverPresent(
    file: string,
    platform: Platform,
    arch: Arch,
) {
    const infoFile = `${file}.txt`;
    if ((await exists(file)) && (await exists(infoFile))) {
        const info = JSON.parse((await readFile(infoFile)).toString());
        return info?.platform === platform && info?.arch === arch;
    }
    return false;
}

export async function getDriver(
    {
        platform,
        destination = process.cwd(),
        arch = Arch.x64,
        force = false,
    }: Options,
    file: string,
    fn: (
        platform: Platform,
        arch: Arch,
        destination: string,
    ) => Promise<string>,
) {
    if (!force && (await checkDriverPresent(file, platform, arch))) {
        info('No need to download driver.', file);
        return file;
    }

    info('Download driver.', file);
    const assetUrl = await fn(platform, arch, destination);
    await writeFileInfo(file, platform, arch, assetUrl);
}
