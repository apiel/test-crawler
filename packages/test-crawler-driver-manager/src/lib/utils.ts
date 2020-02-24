import * as AdmZip from 'adm-zip';
import axios from 'axios';
import { extract } from 'tar';

export async function downloadZip(url: string, cwd: string) {
    const { data } = await axios.get(url, {
        responseType: 'arraybuffer',
    });
    const admZip = new AdmZip(data);
    return admZip.extractAllTo(cwd, true);
}

export async function downloadTar(url: string, cwd: string) {
    const response = await axios.get(url, {
        responseType: 'stream',
    });
    response.data.pipe(extract({ cwd }));

    return new Promise((resolve, reject) => {
        response.data.on('finish', resolve);
        response.data.on('error', reject);
    });
}
