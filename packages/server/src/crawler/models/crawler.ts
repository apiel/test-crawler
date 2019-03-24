import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Crawler {
  @Field()
  url: string;
}
