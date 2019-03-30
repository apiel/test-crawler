import { NestFactory } from '@nestjs/core';
import { NestExpressApplication  } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useStaticAssets(
      join(__dirname, '../../app/build'),
  );
  app.use(/^\/(?!graphql|api).*/, express.static(join(__dirname, '../../app/build')));
  await app.listen(3000);
}
bootstrap();
