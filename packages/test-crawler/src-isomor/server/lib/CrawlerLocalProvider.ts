import { readJSON, mkdirp, readdir } from 'fs-extra';
import { PROJECT_FOLDER, CRAWL_FOLDER } from './config';
import { Crawler } from '../typing';

import { join } from 'path';

export class CrawlerLocalProvider {
    getCrawler(projectId: string, timestamp: string): Promise<Crawler> {
        return readJSON(join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, '_.json'));
    }

    async getAllCrawlers(projectId: string): Promise<Crawler[]> {
        const projectFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
        await mkdirp(projectFolder);
        const folders = await readdir(projectFolder);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(timestamp => this.getCrawler(projectId, timestamp)),
        );
        return crawlers;
    }
}
