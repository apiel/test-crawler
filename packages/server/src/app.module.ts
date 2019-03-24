import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CrawlerModule } from './crawler/crawler.module';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [
        GraphQLModule.forRoot({
            // installSubscriptionHandlers: true,
            autoSchemaFile: 'schema.gql',
        }),
        CrawlerModule,
        ConfigModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
