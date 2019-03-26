import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class Config {
  @Field()
  MAX_HISTORY: number;
}
