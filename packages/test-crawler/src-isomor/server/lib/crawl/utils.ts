import { join } from 'path';
import { PROJECT_FOLDER, CRAWL_FOLDER } from '../config';
import { mkdirp, readdir } from 'fs-extra';

export async function getFolders(projectId: string) {
    const projectFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
    await mkdirp(projectFolder);
    const folders = await readdir(projectFolder);
    folders.sort();

    return folders;
}

export function getQueueFolder(distFolder: string) {
    return join(distFolder, 'queue');
}