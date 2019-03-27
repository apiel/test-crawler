import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler';
import { CrawlerService } from './crawler.service';
import { StartCrawler } from './models/startCrawler';
import { PageData } from './models/page';

@Resolver(() => Crawler)
export class CrawlerResolver {
    constructor(private readonly crawlerService: CrawlerService) {}

    @Query(() => Crawler)
    getCrawler(
        @Args('timestamp') timestamp: string,
    ): Promise<Crawler> {
        return this.crawlerService.getOne(timestamp);
    }

    @Query(() => [Crawler])
    getCrawlers(): Promise<Crawler[]> {
        return this.crawlerService.getAll();
    }

    @Mutation(() => StartCrawler)
    startCrawler(
        @Args('crawler') crawler: CrawlerInput,
    ): Promise<StartCrawler> {
        return this.crawlerService.start(crawler);
    }

    @Query(() => [PageData])
    getPages(
        @Args('timestamp') timestamp: string,
    ): Promise<PageData[]> {
        return this.crawlerService.getPages(timestamp);
    }
}
