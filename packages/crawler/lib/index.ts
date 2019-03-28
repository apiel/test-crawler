import { readdir, readJSON, mkdir, writeJSON, readFile } from 'fs-extra';
import { join, extname } from 'path';
import * as rimraf from 'rimraf';
import * as md5 from 'md5';

import { CRAWL_FOLDER, MAX_HISTORY } from './config';
import { getFolders, addToQueue, getQueueFolder, getFilePath } from './utils';

import * as config from './config';
import { Crawler, CrawlerInput, StartCrawler, PageData } from './typing';

export { Crawler, CrawlerInput, StartCrawler, Navigation, PageData, Performance, Timing } from './typing';

export const getConfig = () => config;

export class CrawlerProvider {
    image(timestamp: string, id: string): Promise<Buffer> {
        const folder = join(CRAWL_FOLDER, timestamp);
        const filePath = getFilePath(id, folder);
        return readFile(filePath('png'));
    }

    async getPages(timestamp: string): Promise<PageData[]> {
        const folder = join(CRAWL_FOLDER, timestamp);
        const files = await readdir(folder);
        return Promise.all(
            files.filter(file => extname(file) === '.json')
                .map(file => readJSON(join(folder, file))),
        );
    }

    getCrawler(timestamp: string): Promise<Crawler> {
        return readJSON(join(CRAWL_FOLDER, timestamp, '_.json'));
    }

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
            throw (new Error('Something went wrong while adding job to queue'));
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
