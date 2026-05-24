import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

const MAX_BACKUPS_DEFAULT = 50;

/**
 * Create a timestamped backup of a file before overwriting.
 * Backups are stored in a `.backup/` directory alongside the original file.
 * Old backups are automatically pruned when the count exceeds maxBackups.
 * @param targetPath - Absolute path to the file to back up
 * @param maxBackups - Maximum number of backups to retain (default: 50)
 */
export async function backupExisting(
  targetPath: string,
  maxBackups: number = MAX_BACKUPS_DEFAULT,
): Promise<void> {
  try {
    const dir = path.dirname(targetPath);
    const base = path.basename(targetPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(dir, '.backup', timestamp);
    await fs.ensureDir(backupDir);
    const backupPath = path.join(backupDir, base);
    await fs.copy(targetPath, backupPath);
    logger.info(`Backed up ${base} to ${path.relative(process.cwd(), backupPath)}`);
    await pruneBackups(dir, maxBackups);
  } catch (err: any) {
    logger.error(`Failed to backup ${targetPath}: ${err.message || err}`);
    throw err;
  }
}

export async function listBackups(dir: string): Promise<string[]> {
  const backupRoot = path.join(dir, '.backup');
  if (!fs.existsSync(backupRoot)) return [];
  const entries = fs.readdirSync(backupRoot).filter(e => {
    const full = path.join(backupRoot, e);
    return fs.statSync(full).isDirectory();
  });
  return entries.sort();
}

export async function restoreBackup(
  targetDir: string,
  backupTimestamp: string,
): Promise<string[]> {
  const backupPath = path.join(targetDir, '.backup', backupTimestamp);
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup not found: ${backupTimestamp}`);
  }
  const files = fs.readdirSync(backupPath);
  for (const file of files) {
    fs.copySync(path.join(backupPath, file), path.join(targetDir, file));
  }
  return files;
}

async function pruneBackups(dir: string, max: number): Promise<void> {
  const timestamps = await listBackups(dir);
  while (timestamps.length > max) {
    const oldest = timestamps.shift()!;
    await fs.remove(path.join(dir, '.backup', oldest));
  }
}
