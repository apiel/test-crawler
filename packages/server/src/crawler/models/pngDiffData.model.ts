import { Field, ObjectType, ID } from 'type-graphql';
import { PngDiffData as PngDiffDataInterface } from 'test-crawler-lib';
import { PngDiffDataZone } from './pngDiffDataZone.model';

@ObjectType()
export class PngDiffData implements PngDiffDataInterface {
    @Field()
    pixelDiffRatio: number;

    @Field(type => [PngDiffDataZone])
    zones: PngDiffDataZone[];
}
