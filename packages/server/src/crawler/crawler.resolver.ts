import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler';
import { CrawlerService } from './crawler.service';

@Resolver(() => Crawler)
export class CrawlerResolver {
    constructor(private readonly crawlerService: CrawlerService) {}

    @Query(() => [Crawler])
    crawlers(): Promise<Crawler[]> {
        return this.crawlerService.getAll();
    }

    @Mutation(() => Crawler)
    startCrawler(
        @Args('crawler') crawler: CrawlerInput,
    ): Promise<Crawler> {
        return this.crawlerService.start(crawler);
    }
}
