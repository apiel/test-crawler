import * as AdmZip from 'adm-zip';
import axios from 'axios';
import { extract } from 'tar';
import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

import { Platform } from '.';

export const mkdir = promisify(fs.mkdir);

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
