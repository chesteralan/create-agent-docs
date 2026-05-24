import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';
import { listBackups, restoreBackup } from '../generators/backup.js';

export interface RestoreOptions {
  dryRun?: boolean;
  yes?: boolean;
}

export async function restoreCommand(
  backupId?: string,
  options: RestoreOptions = {},
): Promise<void> {
  const docsDir = path.resolve('docs');

  if (!fs.existsSync(docsDir)) {
    logger.warn('No docs/ directory found.');
    return;
  }

  const backups = await listBackups(docsDir);

  if (backups.length === 0) {
    logger.warn('No backups found in docs/.backup/');
    return;
  }

  if (!backupId) {
    logger.info('Available backups:');
    backups.forEach((b, i) => {
      logger.info(`  ${i + 1}. ${b}`);
    });
    logger.info('Usage: create-agent-docs restore <backup-id>');
    return;
  }

  if (!backups.includes(backupId)) {
    logger.error(`Backup not found: ${backupId}`);
    logger.info(`Available: ${backups.join(', ')}`);
    return;
  }

  const backupPath = path.join(docsDir, '.backup', backupId);
  const files = fs.readdirSync(backupPath);
  logger.info(`Files to restore from ${backupId}:`);
  files.forEach(f => logger.info(`  - ${f}`));

  if (options.dryRun) {
    logger.info('Dry-run complete. No files were restored.');
    return;
  }

  const restored = await restoreBackup(docsDir, backupId);
  logger.success(`Restored ${restored.length} file(s) from ${backupId}`);
}
