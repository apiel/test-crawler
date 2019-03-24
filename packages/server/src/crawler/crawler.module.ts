import { Module } from '@nestjs/common';
import { CrawlerResolver } from './crawler.resolver';
import { CrawlerService } from './crawler.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
    providers: [CrawlerResolver, CrawlerService],
    imports: [ConfigModule],
})
export class CrawlerModule {}
