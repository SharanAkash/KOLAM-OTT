import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS - Allow web app and ALB
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    'http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com',
    process.env.CORS_ORIGINS?.split(',') || [],
  ].flat().filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Serve static files from uploads directory (for local storage)
  const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });
  console.log(`📁 Serving uploads from: ${uploadDir}`);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Kolam OTT API running on http://localhost:${port}`);
}

bootstrap();
