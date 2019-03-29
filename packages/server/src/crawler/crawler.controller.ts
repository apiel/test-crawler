import { Controller, Get, Req, Res, Header } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Request, Response } from 'express';

@Controller('crawler')
export class CrawlerController {
    constructor(private readonly crawlerService: CrawlerService) {}

    @Get('/thumbnail/:folder/:id')
    @Header('Content-Type', 'image/png')
    async thumbnail(@Req() request: Request, @Res() res: Response) {
        const { params: { folder, id } } = request;
        const image = await this.crawlerService.thumbnail(folder, id);
        res.end(image);
    }
}
