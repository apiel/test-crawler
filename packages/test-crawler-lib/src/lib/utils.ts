import { readdir, pathExists, outputJson } from 'fs-extra';

import * as md5 from 'md5';

import { CRAWL_FOLDER } from './config';
import { join } from 'path';
import { PageData, Viewport } from './typing';

export async function getFolders() {
    const folders = await readdir(CRAWL_FOLDER);
    folders.sort();

    return folders;
}

export type FilePath = (extension: string) => string;
export const getFilePath = (id: string, distFolder: string): FilePath => (extension: string) => {
    return join(distFolder, `${id}.${extension}`);
};

export async function addToQueue(url: string, viewport: Viewport, distFolder: string): Promise<boolean> {
    const id = md5(`${url}-${JSON.stringify(viewport)}`);
    const histFile = getFilePath(id, distFolder)('json');
    const queueFile = getFilePath(id, getQueueFolder(distFolder))('json');

    if (!(await pathExists(queueFile)) && !(await pathExists(histFile))) {
        await savePageInfo(queueFile, { url, id });
        return true;
    }
    return false;
}

export function getQueueFolder(distFolder: string) {
    return join(distFolder, 'queue');
}

export function savePageInfo(file: string, pageData: PageData) {
    return outputJson(file, pageData, { spaces: 4 });
}
