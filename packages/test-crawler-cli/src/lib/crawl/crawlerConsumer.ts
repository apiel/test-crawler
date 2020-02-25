import { info, warn } from 'logol';
import {
    readdir,
    readJSON,
    move,
    pathExists,
    mkdirp,
    outputJSON,
    outputFile,
    readFile,
} from 'fs-extra';
import { join } from 'path';
import {
    CONSUMER_COUNT,
    Browser,
    Project,
} from 'test-crawler-core';
import md5 = require('md5');

import { loadPage } from './crawlPage';
import {
    pathQueueFolder,
    pathInfoFile,
    pathCrawlFolder,
    pathProjectFile,
    pathQueueFile,
    pathSiblingFile,
    pathProjectsFolder,
} from '../path';
import { Consumer, QueueProps, PickerResponse } from './consumer';

interface ToCrawl {
    projectId: string;
    id: any;
    url: any;
    timestamp: string;
}

let cachePicker: PickerResponse;
export const consumer: Consumer = {
    picker: async () => {
        if (cachePicker) {
            return cachePicker;
        }
        const data = await pickFromQueues();
        if (data) {
            const { projectId, id, timestamp } = data;
            const queue = await getQueue(projectId);
            cachePicker = {
                data,
                apply: async () => {
                    info('Crawl', { projectId, timestamp, id });
                    await move(
                        pathQueueFile(projectId, timestamp, id),
                        pathInfoFile(projectId, timestamp, id),
                    );
                    cachePicker = undefined;
                },
                queue,
            };
            return cachePicker;
        }
    },
    runner: async ({ projectId, id, url, timestamp }: ToCrawl) =>
        loadPage(projectId, id, url, timestamp),
};

async function pickFromQueue(
    projectId: string,
    timestamp: string,
): Promise<ToCrawl> {
    const queueFolder = pathQueueFolder(projectId, timestamp);
    if (await pathExists(queueFolder)) {
        const [file] = await readdir(queueFolder);
        if (file) {
            try {
                const queueFile = join(queueFolder, file);
                const { id, url } = await readJSON(queueFile);
                return { projectId, id, url, timestamp };
            } catch (error) {
                warn('Crawl possible error', error);
            }
        }
    }
}

async function pickFromQueues(): Promise<ToCrawl> {
    const projectFolders = await readdir(pathProjectsFolder());
    for (const projectId of projectFolders) {
        const crawlFolder = pathCrawlFolder(projectId);
        await mkdirp(crawlFolder);
        const timestampFolders = await readdir(crawlFolder);
        for (const timestamp of timestampFolders) {
            const toCrawl = await pickFromQueue(projectId, timestamp);
            if (toCrawl) {
                return toCrawl;
            }
        }
    }
}

// some browser support only one instance at once
async function getQueue(projectId: string): Promise<QueueProps> {
    const {
        crawlerInput: { browser },
    }: Project = await readJSON(pathProjectFile(projectId));
    if (
        browser === Browser.IeSelenium ||
        // || browser === Browser.EdgeSelenium
        browser === Browser.SafariSelenium
    ) {
        return {
            name: `browser-${browser}`,
            maxConcurrent: 1,
        };
    }
    return {
        name: 'browser',
        maxConcurrent: CONSUMER_COUNT,
    };
}

export async function pushToCrawl(
    url: string,
    projectId: string,
    timestamp: string,
    limit: number = 0,
): Promise<boolean> {
    const cleanUrl = url.replace(/(\n\r|\r\n|\n|\r)/gm, '');
    const id = md5(cleanUrl);
    const resultFile = pathInfoFile(projectId, timestamp, id);
    const queueFile = pathQueueFile(projectId, timestamp, id);

    if (!(await pathExists(queueFile)) && !(await pathExists(resultFile))) {
        if (
            !limit ||
            (await updateSiblingCount(cleanUrl, projectId, timestamp)) < limit
        ) {
            await outputJSON(queueFile, { url: cleanUrl, id }, { spaces: 4 });
        }
        return true;
    }
    return false;
}

// this is for the limit in spider bot
async function updateSiblingCount(
    url: string,
    projectId: string,
    timestamp: string,
) {
    const urlPaths = url.split('/').filter(s => s);
    urlPaths.pop();
    const id = md5(urlPaths.join('/'));
    const file = pathSiblingFile(projectId, timestamp, id);
    let count = 0;
    if (await pathExists(file)) {
        count = parseInt((await readFile(file)).toString(), 10) + 1;
    }
    await outputFile(file, count);
    return count;
}
