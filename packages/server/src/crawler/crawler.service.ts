import { Injectable } from '@nestjs/common';
import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler';
import { ConfigService } from 'src/config/config.service';
import { readdir, readJSON } from 'fs-extra';
import { join } from 'path';

@Injectable()
export class CrawlerService {
    constructor(private readonly configService: ConfigService) { }

    async start(crawler: CrawlerInput): Promise<Crawler> {
        console.log('start crawler', crawler);
        return;
    }

    async getAll(): Promise<Crawler[]> {
        const folders = await readdir(this.configService.config.CRAWL_FOLDER);
        console.log('folders', folders);
        const crawlers: Crawler[] = await Promise.all(
            folders.map(folder => readJSON(join(
                this.configService.config.CRAWL_FOLDER,
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
