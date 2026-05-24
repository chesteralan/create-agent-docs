# F25 — `restore` command for backups

**Tier:** 5 — Lower Priority  
**Effort:** 3 hours

## Problem

No way to list or restore from timestamped backups.

## Task

Add `restore` command to list available backups and restore from a selected snapshot.

## Acceptance Criteria

- [ ] `restore` command lists all available backups
- [ ] `restore <id>` restores from a specific backup
- [ ] `restore --dry-run` shows what would be restored
- [ ] Confirmation prompt before overwriting

## Concrete Plan

**Note:** This is a subset of F13. If F13 is implemented, this is already done. If F13 is deferred, implement separately.

1. **Create `src/commands/restore.ts`**:
   ```ts
   import fs from 'fs-extra';
   import path from 'path';
   import { logger } from '../utils/logger.js';
   import { listBackups, restoreBackup } from '../generators/backup.js';
   
   export interface RestoreOptions {
     dryRun?: boolean;
   }
   
   export async function restoreCommand(
     backupId?: string,
     options: RestoreOptions = {},
   ): Promise<void> {
     const docsDir = path.resolve('docs');
     const backups = await listBackups(docsDir);
     
     if (backups.length === 0) {
       logger.warn('No backups found in docs/.backup/');
       return;
     }
     
     // If no backup ID provided, list available
     if (!backupId) {
       logger.info('Available backups:');
       backups.forEach((b, i) => {
         logger.info(`  ${i + 1}. ${b}`);
       });
       logger.info('Usage: create-agent-docs restore <backup-id>');
       return;
     }
     
     // Validate backup ID
     if (!backups.includes(backupId)) {
       logger.error(`Backup not found: ${backupId}`);
       logger.info(`Available: ${backups.join(', ')}`);
       return;
     }
     
     // Show what will be restored
     const backupPath = path.join(docsDir, '.backup', backupId);
     const files = fs.readdirSync(backupPath);
     logger.info(`Files to restore from ${backupId}:`);
     files.forEach(f => logger.info(`  - ${f}`));
     
     if (options.dryRun) {
       logger.info('Dry-run complete. No files were restored.');
       return;
     }
     
     // Confirm and restore
     // (prompt or --yes flag)
     await restoreBackup(docsDir, backupId);
     logger.success(`Restored ${files.length} file(s) from ${backupId}`);
   }
   ```

2. **Add `restore` command** in `src/cli.ts`:
   ```ts
   program
     .command('restore [backup-id]')
     .description('Restore documentation from a backup')
     .option('--dry-run', 'show what would be restored')
     .option('-y, --yes', 'auto-confirm restore')
     .action(async (backupId, options) => {
       //...
     });
   ```

## Files

- `src/commands/restore.ts` (new)
- `src/generators/backup.ts`
- `src/cli.ts`
