import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EnhanceService } from './enhance.service';

@Controller('enhance')
export class EnhanceController {
  constructor(private readonly enhanceService: EnhanceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async handleEnhancement(
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: string
  ) {
    const imageUrl = await this.enhanceService.enhanceImage(file, imageType);
    return {
      message: 'Image enhanced successfully',
      imageUrl,
    };
  }
}



