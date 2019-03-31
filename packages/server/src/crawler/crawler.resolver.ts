import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler.model';
import { CrawlerService } from './crawler.service';
import { StartCrawler } from './models/startCrawler.model';
import { PageData } from './models/page.model';

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

    @Query(() => [PageData])
    getPins(): Promise<PageData[]> {
        return this.crawlerService.getPins();
    }

    @Mutation(() => StartCrawler)
    startCrawler(
        @Args('crawler') crawler: CrawlerInput,
    ): Promise<StartCrawler> {
        return this.crawlerService.start(crawler);
    }

    @Mutation(() => PageData)
    pin(
        @Args('timestamp') timestamp: string,
        @Args('id') id: string,
    ): Promise<PageData> {
        return this.crawlerService.pin(timestamp, id);
    }

    @Mutation(() => PageData)
    setZoneStatus(
        @Args('timestamp') timestamp: string,
        @Args('id') id: string,
        @Args('index') index: number,
        @Args('status') status: string,
    ): Promise<PageData> {
        return this.crawlerService.setZoneStatus(timestamp, id, index, status);
    }
}
