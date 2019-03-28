import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Success {
  @Field()
  success: boolean;
}
