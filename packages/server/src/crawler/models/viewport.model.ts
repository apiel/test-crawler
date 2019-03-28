import { Field, InputType, ObjectType } from 'type-graphql';
import { Viewport as ViewportInterface } from 'test-crawler-lib';

@InputType('ViewPortInput')
@ObjectType()
export class ViewPort implements ViewportInterface {
  @Field({ defaultValue: 800 })
  width: number;

  @Field({ defaultValue: 600 })
  height: number;

  @Field({nullable: true})
  isMobile?: boolean;

  @Field({nullable: true})
  hasTouch?: boolean;

  @Field({nullable: true})
  isLandscape?: boolean;
}
