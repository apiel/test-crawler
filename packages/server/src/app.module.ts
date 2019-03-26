import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
    imports: [
        GraphQLModule.forRoot({
            // installSubscriptionHandlers: true,
            autoSchemaFile: 'schema.gql',
        }),
        CrawlerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
