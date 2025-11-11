import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Use NestExpressApplication for static file serving
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS if needed (for frontend communication)
  app.enableCors();

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that don't have decorators
      forbidNonWhitelisted: true, // throw error if non-whitelisted properties are present
      transform: true, // automatically transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
