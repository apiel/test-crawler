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
        // return;
        return {
            ...crawler,
            timestamp: 12313124,
        };
    }

    async getAll(): Promise<Crawler[]> {
        const folders = await readdir(this.configService.config.CRAWL_FOLDER);
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
