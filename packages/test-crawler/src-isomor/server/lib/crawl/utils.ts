import { join } from 'path';
import {
    PROJECT_FOLDER,
    CRAWL_FOLDER,
    QUEUE_FOLDER,
    ROOT_FOLDER,
    CODE_FOLDER,
    PIN_FOLDER,
} from '../config';
import {
    mkdirp,
    readdir,
} from 'fs-extra';

export async function getFolders(projectId: string) {
    const projectFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
    await mkdirp(projectFolder);
    const folders = await readdir(projectFolder);
    folders.sort();

    return folders;
}

export function pathQueueFolder(projectId: string, timestamp: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, QUEUE_FOLDER);
}

export function pathQueueFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, QUEUE_FOLDER, `${id}.json`);
}

export function pathSiblingFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, 'sibling', id);
}

export function pathCrawlFolder(projectId: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
}

export function pathResultFolder(projectId: string, timestamp: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp);
}

export function pathCrawlerFile(projectId: string, timestamp: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, `_.json`);
}

export function pathInfoFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, `${id}.json`);
}

export function pathImageFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, `${id}.png`);
}

export function pathSourceFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, `${id}.html`);
}

export function pathPinInfoFile(projectId: string, id: string) {
    return join(PROJECT_FOLDER, projectId, PIN_FOLDER, `${id}.json`);
}

export function pathPinImageFile(projectId: string, id: string) {
    return join(PROJECT_FOLDER, projectId, PIN_FOLDER, `${id}.png`);
}

export function pathPinSourceFile(projectId: string, id: string) {
    return join(PROJECT_FOLDER, projectId, PIN_FOLDER, `${id}.html`);
}

export function pathProjectFile(projectId: string) {
    // return join(ROOT_FOLDER, PROJECT_FOLDER, projectId, 'project.json');
    return join(PROJECT_FOLDER, projectId, 'project.json'); // ROOT_FOLDER might not be necessary
}

export function pathCodeJsFile(projectId: string, id: string) {
    return join(ROOT_FOLDER, PROJECT_FOLDER, projectId, CODE_FOLDER, `${id}.js`);
}
