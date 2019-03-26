import { readdir, readJSON } from 'fs-extra';
import { join } from 'path';

import { CRAWL_FOLDER } from './config';

export interface Crawler {
    url: string;
    timestamp: number;
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
}

// const crawlers: Crawler[] = await Promise.all(
//     folders.filter(file => extname(file) === '.json')
//            .map(file => readJSON(file)),
// );
