import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Crawler { // should extend from lib
  @Field()
  url: string;

  @Field()
  timestamp: number;
}
