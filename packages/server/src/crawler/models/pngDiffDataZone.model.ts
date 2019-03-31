import { Field, ObjectType, ID } from 'type-graphql';
import { PngDiffDataZone as PngDiffDataZoneInterface } from 'test-crawler-lib';
import { Zone } from './zone.model';

@ObjectType()
export class PngDiffDataZone implements PngDiffDataZoneInterface {
    @Field()
    status: string;

    @Field(type => Zone)
    zone: Zone;
}
