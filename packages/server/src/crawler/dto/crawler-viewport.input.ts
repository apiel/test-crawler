import { Field, InputType } from 'type-graphql';

@InputType()
export class CrawlerViewPortInput {
  @Field({ defaultValue: 800 })
  width: number;

  @Field({ defaultValue: 600 })
  height: number;

  @Field({nullable: true})
  isMobile: boolean;

  @Field({nullable: true})
  hasTouch: boolean;

  @Field({nullable: true})
  isLandscape: boolean;
}
