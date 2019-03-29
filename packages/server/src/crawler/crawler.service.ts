import { Injectable } from '@nestjs/common';
import { CrawlerProvider } from 'test-crawler-lib';
import * as sharp from 'sharp';

import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler.model';
import { StartCrawler } from './models/startCrawler.model';
import { PageData } from './models/page.model';

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

    getPages(timestamp: string): Promise<PageData[]> {
        return this.crawlerProvider.getPages(timestamp);
    }

    getPins(): Promise<PageData[]> {
        return this.crawlerProvider.getBasePages();
    }

    async thumbnail(folder: string, id: string, width: number = 300): Promise<Buffer> {
        const image = await this.crawlerProvider.image(folder, id);
        return sharp(image).resize(width).toBuffer();
    }

    pin(timestamp: string, id: string): Promise<PageData> {
        return this.crawlerProvider.copyToBase(timestamp, id);
    }
}
