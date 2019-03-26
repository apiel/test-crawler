import { Field, ObjectType } from 'type-graphql';
import { StartCrawler as StartCrawlerInterface } from 'test-crawler-lib';
import { Crawler } from './crawler';
import { Config } from './config';

@ObjectType()
export class StartCrawler implements StartCrawlerInterface {
  @Field()
  crawler: Crawler;

  @Field()
  config: Config;
}
