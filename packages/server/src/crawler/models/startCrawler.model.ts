import { Field, ObjectType } from 'type-graphql';
import { StartCrawler as StartCrawlerInterface } from 'test-crawler-lib';
import { Crawler } from './crawler.model';
import { Config } from './config.model';

@ObjectType()
export class StartCrawler implements StartCrawlerInterface {
  @Field()
  crawler: Crawler;

  @Field()
  config: Config;
}
