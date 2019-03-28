import { Field, ObjectType, ID } from 'type-graphql';
import { PageData as PageDataInterface } from 'test-crawler-lib';
import { Png } from './png.model';

@ObjectType()
export class PageData implements PageDataInterface {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  // performance?: Performance;

  @Field({ nullable: true })
  png?: Png;
}
