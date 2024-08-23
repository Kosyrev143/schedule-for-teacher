import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Путь, куда будут сохраняться загруженные файлы
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
