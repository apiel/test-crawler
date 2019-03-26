import { Field, ObjectType, ID } from 'type-graphql';
import { Crawler as CrawlerInterface } from 'test-crawler-lib';

@ObjectType()
export class Crawler implements CrawlerInterface {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field()
  timestamp: number;
}
