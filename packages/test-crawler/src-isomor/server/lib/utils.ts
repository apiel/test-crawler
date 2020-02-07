import { readdir, pathExists, outputJson, readFile, outputFile, readJSON, mkdirp } from 'fs-extra';
import { join } from 'path';
import * as md5 from 'md5';

import { CRAWL_FOLDER, CODE_FOLDER, PROJECT_FOLDER } from './config';
import { PageData, Viewport, CodeInfoList } from '../typing';

export async function getFolders(projectId: string) {
    const projectFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
    await mkdirp(projectFolder);
    const folders = await readdir(projectFolder);
    folders.sort();

    return folders;
}

export type FilePath = (extension: string) => string;
export const getFilePath = (id: string, distFolder: string): FilePath => (extension: string) => {
    return join(distFolder, `${id}.${extension}`);
};

export async function addToQueue(url: string, viewport: Viewport, distFolder: string, limit: number = 0): Promise<boolean> {
    console.log('addToQueue', url, viewport, distFolder);
    const id = md5(`${url}-${JSON.stringify(viewport)}`);
    const histFile = getFilePath(id, distFolder)('json');
    const queueFile = getFilePath(id, getQueueFolder(distFolder))('json');

    if (!(await pathExists(queueFile)) && !(await pathExists(histFile))) {
        if (!limit || (await updateSiblingCount(url, distFolder)) < limit) {
            await outputJson(queueFile, { url, id }, { spaces: 4 });
        }
        return true;
    }
    return false;
}

async function updateSiblingCount(url: string, distFolder: string) {
    const urlPaths = url.split('/').filter(s => s);
    urlPaths.pop();
    const id = md5(urlPaths.join('/'));
    const file = join(distFolder, 'sibling', id);
    let count = 0;
    if (await pathExists(file)) {
        count = parseInt((await readFile(file)).toString(), 10) + 1;
    }
    await outputFile(file, count);
    return count;
}

export function getQueueFolder(distFolder: string) {
    return join(distFolder, 'queue');
}
