import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { convertCR3toJPEG } from '../utils/cr3Converter';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class EnhanceService {
  async enhanceImage(file: Express.Multer.File, imageType: string): Promise<string> {
    const originalPath = file.path;
    const outputDir = path.join(__dirname, '../../uploads');
    let processedPath = originalPath;

    // Convert .cr3 to JPEG if needed
    if (imageType === 'cr3' && path.extname(originalPath).toLowerCase() === '.cr3') {
      processedPath = await convertCR3toJPEG(originalPath, outputDir);
    }

    // Run SwinIR enhancement script
    try {
      const { stdout, stderr } = await execAsync(`python3 ./SwinIR/enhance.py "${processedPath}"`);
      console.log('SwinIR stdout:', stdout);
      if (stderr) console.error('SwinIR stderr:', stderr);
    } catch (error) {
      console.error('Failed to run enhancement script:', error);
      throw new Error('Enhancement failed');
    }

    // Construct enhanced file path
    const extension = path.extname(processedPath);
    const enhancedPath = processedPath.replace(extension, `_enhanced${extension}`);

    if (!fs.existsSync(enhancedPath)) {
      throw new Error('Enhanced file not found at expected path');
    }

    const fileName = path.basename(enhancedPath);
    const publicUrl = `https://speed-edit-backend.onrender.com/${fileName}`;

    return publicUrl;
  }
}

