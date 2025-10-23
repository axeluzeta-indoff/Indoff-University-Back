import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const corsOrigins = config.get<string>('CORS_ORIGIN')?.split(',') || [];
  app.enableCors({
    origin: corsOrigins, // coincide EXACTO con el origin del front
    credentials: true, // pon true solo si usarás cookies / credentials
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`CORS origins: ${corsOrigins.join(', ') || 'none'}`);
}
void bootstrap();
