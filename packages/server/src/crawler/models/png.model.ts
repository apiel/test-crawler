import { Field, ObjectType, ID } from 'type-graphql';
import { PngDiffData } from './pngDiffData.model';

@ObjectType()
export class Png {
    @Field()
    width: number;

    @Field({ nullable: true })
    diff?: PngDiffData;
}
