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
import axios from 'axios';
import { Response } from 'express';
import * as fs from 'fs';

const CLIPDROP_API_KEY = 'c90f643303c33d26f527af807f113c71e6d2668c16ca88938584b2d5239f1d7389dab8af78404305b7ea440e5dbc6428'; // <-- Your Clipdrop API key

@Controller()
export class AppController {
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
    @UploadedFile() file,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const { email, imageType } = body;

    if (!file || !email || !imageType) {
      return res.status(400).json({ message: 'Missing fields or file' });
    }

    try {
      const imageBuffer = fs.readFileSync(file.path);

      const response = await axios.post(
        'https://clipdrop-api.co/enhance/v1',
        imageBuffer,
        {
          headers: {
            'x-api-key': CLIPDROP_API_KEY,
            'Content-Type': 'application/octet-stream',
          },
          responseType: 'arraybuffer',
        }
      );

      // Send enhanced image directly back as file download
          res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="enhanced-${file.filename}"`
      );
      res.send(response.data);
    } catch (err) {
      console.error('Clipdrop error:', err?.response?.data || err.message || err);
      return res
        .status(500)
        .json({ message: 'Failed to enhance image', error: err?.message || err });
    }
  }
}




