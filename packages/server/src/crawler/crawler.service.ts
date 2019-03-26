import { Injectable } from '@nestjs/common';
import { CrawlerProvider } from 'test-crawler-lib';

import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler';
import { StartCrawler } from './models/startCrawler';

@Injectable()
export class CrawlerService {
    constructor(private readonly crawlerProvider: CrawlerProvider) { }

    start(crawlerInput: CrawlerInput): Promise<StartCrawler> {
        return this.crawlerProvider.startCrawler(crawlerInput);
    }

    getAll(): Promise<Crawler[]> {
        return this.crawlerProvider.getAllCrawlers();
    }

    getOne(timestamp: string): Promise<Crawler> {
        return this.crawlerProvider.getCrawler(timestamp);
    }
}
