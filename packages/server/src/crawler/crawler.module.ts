import { Module } from '@nestjs/common';
import { CrawlerResolver } from './crawler.resolver';
import { CrawlerService } from './crawler.service';
import { CrawlerProvider } from 'test-crawler-lib';
import { CrawlerController } from './crawler.controller';

const crawlerProvider = {
    provide: CrawlerProvider,
    useValue: new CrawlerProvider(),
};
@Module({
    providers: [CrawlerResolver, CrawlerService, crawlerProvider],
    controllers: [CrawlerController],
})
export class CrawlerModule { }
