import { Injectable } from '@nestjs/common';
import { CrawlerInput } from './dto/crawler.input';
import { Crawler } from './models/crawler';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class CrawlerService {
    constructor(private readonly configService: ConfigService) {}

    async start(crawler: CrawlerInput): Promise<Crawler> {
        console.log('start crawler', crawler);
        return;
    }

    async getAll(): Promise<Crawler[]> {
        const crawlers: Crawler[] = [];
        return crawlers;
    }
}
