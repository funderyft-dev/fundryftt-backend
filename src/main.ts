import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on port: ${port}`);
}

bootstrap();
