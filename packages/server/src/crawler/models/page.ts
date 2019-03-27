import { Field, ObjectType, ID } from 'type-graphql';
import { PageData as PageDataInterface } from 'test-crawler-lib';

@ObjectType()
export class PageData {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  pixelDiffRatio?: number;

  // pngDiffZone?: Zone[];
  // performance?: Performance;
}
