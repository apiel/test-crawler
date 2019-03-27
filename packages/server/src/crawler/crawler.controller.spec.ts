import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerController } from './crawler.controller';

describe('Crawler Controller', () => {
  let controller: CrawlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlerController],
    }).compile();

    controller = module.get<CrawlerController>(CrawlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
