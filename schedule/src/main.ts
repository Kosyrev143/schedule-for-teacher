import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка статической папки для загруженных файлов
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors();

  const port = process.env.PORT || 3000;
  // Запуск приложения на порту 3000
  await app.listen(port, () => {
    console.log(`Running Api in Mode: ${process.env.NODE_ENV} on port ${port}`);
  });
}

bootstrap();
