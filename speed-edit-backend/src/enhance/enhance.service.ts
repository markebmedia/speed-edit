import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { convertCR3toJPEG } from '../utils/cr3Converter';
import { mergeBracketedImages } from '../utils/mergeBracketed'; // ✅ Fixed import
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class EnhanceService {
  async enhanceImage(file: Express.Multer.File, imageType: string): Promise<string> {
    const originalPath = file.path;
    const outputDir = path.join(__dirname, '../../uploads');
    let processedPath: string = originalPath;

    // 🧪 Convert CR3 to JPEG if needed
    if (imageType === 'cr3' && path.extname(originalPath).toLowerCase() === '.cr3') {
      processedPath = await convertCR3toJPEG(originalPath, outputDir);
    }

    // 🖼️ (Optional) Bracketed merging logic placeholder (for future batch uploads)
    // if (imageType === 'bracketed') {
    //   processedPath = await mergeBracketedImages([...], mergedOutputPath);
    // }

    // ⚙️ Run SwinIR enhancement
    const { stdout } = await execAsync(`python3 ./SwinIR/enhance.py "${processedPath}"`);
    const enhancedPath = processedPath.replace(/\.(jpg|jpeg|png)$/i, '_enhanced.$1');

    // ✅ Ensure enhanced file exists
    if (!fs.existsSync(enhancedPath)) {
      throw new Error('Enhanced file was not created');
    }

    return enhancedPath;
  }
}

