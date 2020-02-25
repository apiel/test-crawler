import { error, info } from 'logol';
import { readdir, pathExists, mkdirp, remove, readJSON } from 'fs-extra';
import { join, basename, extname } from 'path';
import {
    CrawlTarget,
    PageData,
    CRAWL_FOLDER,
    PROJECT_FOLDER,
    MAX_HISTORY,
    ROOT_FOLDER,
} from 'test-crawler-core';
import { promisify } from 'util';
import rimraf = require('rimraf');

import { consumer as resultConsumer } from './resultConsumer';
import { consumer as crawlerConsumer } from './crawlerConsumer';
import { runConsumers, setConsumers } from './consumer';
import { setupCrawler } from './setupCrawler';
import { pathSnapshotFolder, pathInfoFile, pathPinInfoFile } from '../path';

let projectIdForExit: string;

async function beforeAll(crawlTarget?: CrawlTarget) {
    if (crawlTarget) {
        try {
            projectIdForExit = crawlTarget.projectId;
            const jsFile = join(
                ROOT_FOLDER,
                PROJECT_FOLDER,
                crawlTarget.projectId,
                'before.js',
            );
            if (await pathExists(jsFile)) {
                const fn = require(jsFile);
                await fn();
            }
        } catch (err) {
            error('Something went wrong in beforeAll script', err);
        }
    }
}

export async function afterAll(totalDiff: number, totalError: number) {
    info('Done', { totalDiff, totalError });
    if (projectIdForExit) {
        try {
            const jsFile = join(
                ROOT_FOLDER,
                PROJECT_FOLDER,
                projectIdForExit,
                'after.js',
            );
            if (await pathExists(jsFile)) {
                const fn = require(jsFile);
                fn(totalDiff, totalError);
            }
        } catch (err) {
            error('Something went wrong in afterAll script', err);
        }
    }
}

async function prepareFolders() {
    if (!(await pathExists(PROJECT_FOLDER))) {
        await mkdirp(PROJECT_FOLDER);
    }
    return cleanHistory();
}

async function cleanHistory() {
    const projects = await readdir(PROJECT_FOLDER);
    for (const project of projects) {
        const crawlFolder = join(PROJECT_FOLDER, project, CRAWL_FOLDER);
        if (await pathExists(crawlFolder)) {
            const results = await readdir(crawlFolder);
            const cleanUp = results.slice(0, -(MAX_HISTORY - 1));
            for (const toRemove of cleanUp) {
                await promisify(rimraf)(join(crawlFolder, toRemove));
            }
            await cleanSnapshot(project);
        }
    }
}

async function cleanSnapshot(projectId: string) {
    const snapshotFolder = pathSnapshotFolder(projectId);
    if (await pathExists(snapshotFolder)) {
        const files = await readdir(snapshotFolder);
        for (const file of files) {
            const [timestamp, id] = basename(file, extname(file)).split('-');
            const infoFile = pathInfoFile(projectId, timestamp, id);
            if (!(await pathExists(infoFile))) {
                const pinFile = pathPinInfoFile(projectId, id);
                if (!(await pathExists(pinFile))) {
                    info('Remove unused snapshot', snapshotFolder, file);
                    await remove(join(snapshotFolder, file));
                } else {
                    const pin: PageData = await readJSON(pinFile);
                    if (!pin || pin.timestamp !== timestamp) {
                        info('Remove unused snapshot', snapshotFolder, file);
                        await remove(join(snapshotFolder, file));
                    }
                }
            }
        }
    }
}

setConsumers({ crawlerConsumer, resultConsumer });
export async function crawl(
    crawlTarget?: CrawlTarget,
    push?: (payload: any) => void,
) {
    await prepareFolders();
    await beforeAll(crawlTarget);
    crawlTarget && (await setupCrawler(crawlTarget));

    runConsumers(() => {
        const totalDiff = 0;
        const totalError = 0;
        afterAll(totalDiff, totalError);
    });
}
