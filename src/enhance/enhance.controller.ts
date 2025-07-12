import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { EnhanceService } from './enhance.service';
import * as fs from 'fs';

@Controller('enhance')
export class EnhanceController {
  constructor(private readonly enhanceService: EnhanceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        }
      })
    })
  )
  async handleEnhance(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { imageType: string },
    @Res() res: Response
  ) {
    if (!file || !body.imageType) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing file or imageType' });
    }

    try {
      const enhancedPath = await this.enhanceService.enhanceImage(file, body.imageType);
      const finalBuffer = fs.readFileSync(enhancedPath);

      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="enhanced-${file.filename}"`
      );
      res.send(finalBuffer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to enhance image', error: error?.message || error });
    }
  }
}


