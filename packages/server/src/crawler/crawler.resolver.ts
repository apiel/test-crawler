import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler.model';
import { CrawlerService } from './crawler.service';
import { StartCrawler } from './models/startCrawler.model';
import { PageData } from './models/page.model';
import { Success } from './models/success.model';

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

    @Query(() => [PageData])
    getPages(
        @Args('timestamp') timestamp: string,
    ): Promise<PageData[]> {
        return this.crawlerService.getPages(timestamp);
    }

    @Mutation(() => StartCrawler)
    startCrawler(
        @Args('crawler') crawler: CrawlerInput,
    ): Promise<StartCrawler> {
        return this.crawlerService.start(crawler);
    }

    @Mutation(() => Success)
    async pin(
        @Args('timestamp') timestamp: string,
        @Args('id') id: string,
    ): Promise<Success> {
        await this.crawlerService.pin(timestamp, id);
        return { success: true };
    }
}
