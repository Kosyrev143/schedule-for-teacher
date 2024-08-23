import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { UploadDto } from './dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadDto,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Проверка расширения файла
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.originalname
      .slice(file.originalname.lastIndexOf('.'))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Некорректный формат файла',
      });
    }

    try {
      const result = await this.uploadService.processExcelFile(
        uploadDto.surname,
        file.path,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Failed to process file',
      });
    }
  }
}
