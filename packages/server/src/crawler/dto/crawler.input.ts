import { Field, InputType } from 'type-graphql';
import { CrawlerInput as CrawlerInputInterface } from 'test-crawler-lib';
@InputType()
export class CrawlerInput implements CrawlerInputInterface {
  @Field()
  url: string;
}
