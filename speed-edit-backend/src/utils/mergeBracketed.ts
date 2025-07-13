import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

const execAsync = promisify(exec);

/**
 * Merges bracketed exposure images into one using `enfuse`.
 * 
 * @param inputPaths Array of full file paths to input images
 * @param outputPath Full path to the output merged image
 * @returns Enfuse stdout
 */
export async function mergeBracketedImages(inputPaths: string[], outputPath: string): Promise<string> {
  // Ensure all input files exist
  for (const filePath of inputPaths) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Input file does not exist: ${filePath}`);
    }
  }

  // Build enfuse command
  const cmd = `enfuse -o "${outputPath}" ${inputPaths.map(p => `"${p}"`).join(' ')}`;

  try {
    const { stdout, stderr } = await execAsync(cmd);
    if (stderr) console.warn('enfuse stderr:', stderr);
    return stdout;
  } catch (error: any) {
    console.error('Failed to merge bracketed images:', error);
    throw new Error(`Enfuse command failed: ${error.message || error}`);
  }
}
