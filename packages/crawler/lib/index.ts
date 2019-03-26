import { readdir, readJSON, mkdir, writeJSON } from 'fs-extra';
import { join } from 'path';
import * as rimraf from 'rimraf';
import * as md5 from 'md5';

import { CRAWL_FOLDER, MAX_HISTORY } from './config';
import { getFolders, addToQueue, getQueueFolder } from './utils';

import * as config from './config';

export const getConfig = () => config;

export interface CrawlerInput {
    url: string;
}

export interface Crawler extends CrawlerInput {
    id: string;
    timestamp: number;
}

export interface StartCrawler {
    crawler: Crawler;
    config: {
        MAX_HISTORY: number;
    };
}

export class CrawlerProvider {
    async getAllCrawlers(): Promise<Crawler[]> {
        const folders = await readdir(CRAWL_FOLDER);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(folder => readJSON(join(
                CRAWL_FOLDER,
                folder,
                '_.json',
            ))),
        );
        return crawlers;
    }

    async startCrawler(crawlerInput: CrawlerInput): Promise<StartCrawler> {
        await this.cleanHistory();
        const timestamp = Math.floor(Date.now() / 1000);
        const id = md5(`${timestamp}-${crawlerInput.url}`);
        const crawler: Crawler = {
            ...crawlerInput,
            timestamp,
            id,
        };

        const distFolder = join(CRAWL_FOLDER, (timestamp).toString());
        await mkdir(distFolder);
        await mkdir(getQueueFolder(distFolder));
        await writeJSON(join(distFolder, '_.json'), crawler);

        const addedToqueue = await addToQueue(crawlerInput.url, distFolder);
        if (!addedToqueue) {
            throw(new Error('Something went wrong while adding job to queue'));
        }
        return {
            crawler,
            config: { MAX_HISTORY },
        };
    }

    private async cleanHistory() {
        const folders = await getFolders();
        const cleanUp = folders.slice(0, -(MAX_HISTORY - 1));
        cleanUp.forEach((folder) => {
            rimraf.sync(join(CRAWL_FOLDER, folder));
        });
    }
}

// const crawlers: Crawler[] = await Promise.all(
//     folders.filter(file => extname(file) === '.json')
//            .map(file => readJSON(file)),
// );
