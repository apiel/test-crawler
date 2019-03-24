import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerResolver } from './crawler.resolver';

describe('CrawlerResolver', () => {
  let resolver: CrawlerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerResolver],
    }).compile();

    resolver = module.get<CrawlerResolver>(CrawlerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
