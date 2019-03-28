import { Field, ObjectType, ID } from 'type-graphql';
import { PngDiffData as PngDiffDataInterface } from 'test-crawler-lib';
import { Zone } from './zone.model';

@ObjectType()
export class PngDiffData implements PngDiffDataInterface {
    @Field()
    pixelDiffRatio: number;

    @Field(type => [Zone])
    zones: Zone[];
}
