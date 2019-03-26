import { Module } from '@nestjs/common';
import { CrawlerResolver } from './crawler.resolver';
import { CrawlerService } from './crawler.service';
import { CrawlerProvider } from 'test-crawler-lib';

const crawlerProvider = {
    provide: CrawlerProvider,
    useValue: new CrawlerProvider(),
};
@Module({
    providers: [CrawlerResolver, CrawlerService, crawlerProvider],
})
export class CrawlerModule { }
