import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS so frontend can reach this backend
  app.enableCors({
    origin: '*', // You can restrict this later
  });

  // 🔥 Increase upload size limit to 50MB
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // Serve static files from the uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/',
  });

  const port = process.env.PORT || 10000;
  await app.listen(port);
  console.log(`🚀 Backend is running on http://localhost:${port}`);
}
bootstrap();


