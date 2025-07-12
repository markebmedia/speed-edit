import { exec } from 'child_process';

export async function runSwinIREnhancement(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cmd = `python3 ./SwinIR/enhance.py "${filePath}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('SwinIR error:', stderr || err.message);
        return reject(err);
      }
      console.log('SwinIR output:', stdout);
      resolve();
    });
  });
}
