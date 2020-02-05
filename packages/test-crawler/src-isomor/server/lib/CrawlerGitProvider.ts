import { Repository } from 'nodegit';

import { readJSON, mkdirp, readdir } from 'fs-extra';
import { PROJECT_FOLDER, CRAWL_FOLDER } from './config';
import { Crawler, Git } from '../typing';

import { join } from 'path';

export class CrawlerGitProvider {
    getCrawler(git: Git, timestamp: string): Promise<Crawler> {
        return;
        // return readJSON(join(PROJECT_FOLDER, projectId, CRAWL_FOLDER, timestamp, '_.json'));
    }

    async getAllCrawlers(git: Git): Promise<Crawler[]> {
        const repo = await Repository.openExt(git.url, );
        const commit = await repo.getBranchCommit('master');
        const tree = await commit.getTree();
        console.log('tree', tree);
        return [];
        // const projectFolder = join(PROJECT_FOLDER, projectId, CRAWL_FOLDER);
        // await mkdirp(projectFolder);
        // const folders = await readdir(projectFolder);
        // const crawlers: Crawler[] = await Promise.all(
        //     folders.map(timestamp => this.getCrawler(projectId, timestamp)),
        // );
        // return crawlers;
    }
}
