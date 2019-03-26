import { Injectable } from '@nestjs/common';
import { CrawlerProvider } from 'test-crawler-lib';

import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler';

@Injectable()
export class CrawlerService {
    constructor(private readonly crawlerProvider: CrawlerProvider) { }

    async start(crawler: CrawlerInput): Promise<Crawler> {
        console.log('start crawler', crawler);
        // return;
        return {
            ...crawler,
            timestamp: 12313124,
        };
    }

    getAll(): Promise<Crawler[]> {
        return this.crawlerProvider.getAllCrawlers();
    }
}
