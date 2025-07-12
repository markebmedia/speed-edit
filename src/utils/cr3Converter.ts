import { exec } from 'child_process';
import * as path from 'path';

export async function convertCR3toJPEG(inputPath: string, outputDir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!inputPath) {
      return reject(new Error('Input path must be defined'));
    }
    if (!outputDir) {
      return reject(new Error('Output directory must be defined'));
    }

    const baseName = path.basename(inputPath, path.extname(inputPath));
    const ppmPath = path.join(outputDir, `${baseName}.ppm`);
    const jpgPath = path.join(outputDir, `${baseName}.jpg`);

    const dcrawCmd = `/opt/homebrew/bin/dcraw -c "${inputPath}" > "${ppmPath}"`;

    exec(dcrawCmd, (dcrawErr, dcrawStdout, dcrawStderr) => {
      if (dcrawErr) {
        console.error('dcraw error:', dcrawStderr || dcrawErr.message);
        return reject(new Error('Failed to convert CR3 to PPM with dcraw'));
      }

      const convertCmd = `/opt/homebrew/bin/convert "${ppmPath}" "${jpgPath}"`;

      exec(convertCmd, (convertErr, convertStdout, convertStderr) => {
        // Optionally clean up ppm file here if you want
        // fs.unlinkSync(ppmPath);

        if (convertErr) {
          console.error('imagemagick convert error:', convertStderr || convertErr.message);
          return reject(new Error('Failed to convert PPM to JPEG with imagemagick'));
        }

        resolve(jpgPath);
      });
    });
  });
}








