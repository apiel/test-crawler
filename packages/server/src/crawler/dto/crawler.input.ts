import { Field, InputType } from 'type-graphql';
import { CrawlerInput as CrawlerInputInterface } from 'test-crawler-lib';
import { ViewPort } from '../models/viewport.model';
@InputType()
export class CrawlerInput implements CrawlerInputInterface {
  @Field()
  url: string;

  @Field()
  viewport: ViewPort;
}
