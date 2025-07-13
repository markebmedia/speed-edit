import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EnhanceService } from './enhance.service';

@Controller()
export class EnhanceController {
  constructor(private readonly enhanceService: EnhanceService) {}

  @Post('enhance')
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
    @Body() body: any,
    @Res() res
  ) {
    const { imageType } = body;

    try {
      const enhancedPath = await this.enhanceService.enhanceImage(file, imageType);

      const imageUrl = `https://speed-edit.onrender.com/${enhancedPath.replace('uploads/', '')}`;

      return res.json({
        message: 'Enhanced successfully!',
        imageUrl
      });
    } catch (error) {
      console.error('Enhancement failed:', error);
      return res.status(500).json({ message: 'Enhancement failed' });
    }
  }
}



