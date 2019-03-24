import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Crawler {
  @Field(type => ID)
  id: string;

  @Field()
  url: string;
}
