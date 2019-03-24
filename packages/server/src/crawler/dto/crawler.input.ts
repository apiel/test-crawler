import { Field, InputType } from 'type-graphql';

@InputType()
export class CrawlerInput {
  @Field()
  url: string;
}
