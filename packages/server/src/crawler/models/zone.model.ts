import { Field, ObjectType, ID } from 'type-graphql';
import { Zone as ZoneInterface } from 'test-crawler-lib';

@ObjectType()
export class Zone implements ZoneInterface {
    @Field()
    xMin: number;

    @Field()
    yMin: number;

    @Field()
    xMax: number;

    @Field()
    yMax: number;
}
