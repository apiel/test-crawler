import { join } from 'path';
import {
    PROJECT_FOLDER,
    CRAWL_FOLDER,
    QUEUE_FOLDER,
    ROOT_FOLDER,
    CODE_FOLDER,
    PIN_FOLDER,
    SNAPSHOT_FOLDER,
} from './config';

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

export function pathSnapshotFolder(projectId: string) {
    return join(PROJECT_FOLDER, projectId, SNAPSHOT_FOLDER);
}

export function pathImageFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, SNAPSHOT_FOLDER, `${timestamp}-${id}.png`);
}

export function pathSourceFile(projectId: string, timestamp: string, id: string) {
    return join(PROJECT_FOLDER, projectId, SNAPSHOT_FOLDER, `${timestamp}-${id}.html`);
}

export function pathPinInfoFile(projectId: string, id: string) {
    return join(PROJECT_FOLDER, projectId, PIN_FOLDER, `${id}.json`);
}

export function pathProjectFile(projectId: string) {
    // return join(ROOT_FOLDER, PROJECT_FOLDER, projectId, 'project.json');
    return join(PROJECT_FOLDER, projectId, 'project.json'); // ROOT_FOLDER might be necessary
}

export function pathCodeJsFile(projectId: string, id: string) {
    return join(ROOT_FOLDER, PROJECT_FOLDER, projectId, CODE_FOLDER, `${id}.js`);
}

export function pathCodeListFile(projectId: string) {
    return join(ROOT_FOLDER, PROJECT_FOLDER, projectId, CODE_FOLDER, `list.json`);
}