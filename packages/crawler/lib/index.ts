import { readdir, readJSON } from 'fs-extra';
import { join } from 'path';

import { CRAWL_FOLDER } from './config';

export interface Crawler {
    url: string;
    timestamp: number;
}

export const getAllCrawlers = async (): Promise<Crawler[]> => {
    const folders = await readdir(CRAWL_FOLDER);
    const crawlers: Crawler[] = await Promise.all(
        folders.map(folder => readJSON(join(
            CRAWL_FOLDER,
            folder,
            '_.json',
        ))),
    );
    return crawlers;
};

// move pages folder there
// use this lib as factory in server
