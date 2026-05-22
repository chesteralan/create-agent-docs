import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Backup a file or directory before it is overwritten.
 * Creates a `.backup/<timestamp>` folder at the same level as the targetPath and copies the target into it.
 * @param targetPath absolute path of the file/directory to backup
 */
export async function backupExisting(targetPath: string): Promise<void> {
  try {
    const dir = path.dirname(targetPath);
    const base = path.basename(targetPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(dir, '.backup', timestamp);
    await fs.ensureDir(backupDir);
    const backupPath = path.join(backupDir, base);
    await fs.copy(targetPath, backupPath);
    logger.info(`Backed up ${base} to ${path.relative(process.cwd(), backupPath)}`);
  } catch (err: any) {
    logger.error(`Failed to backup ${targetPath}: ${err.message || err}`);
    throw err;
  }
}
