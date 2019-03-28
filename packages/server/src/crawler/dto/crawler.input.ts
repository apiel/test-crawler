import { Field, InputType } from 'type-graphql';
import { CrawlerInput as CrawlerInputInterface } from 'test-crawler-lib';
import { CrawlerViewPortInput } from './crawler-viewport.input';
@InputType()
export class CrawlerInput implements CrawlerInputInterface {
  @Field()
  url: string;

  @Field()
  viewport: CrawlerViewPortInput;
}
