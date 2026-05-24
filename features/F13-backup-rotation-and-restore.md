# F13 — Backup rotation and restore command

**Tier:** 3 — High Impact, High Effort  
**Effort:** 3-4 hours

## Problem

Multiple overwrites create unlimited `.backup/` dirs with no cleanup or restore capability. `src/generators/backup.ts` creates timestamped dirs with no limit.

## Task

Add `--max-backups N` to prune old backups. Add `restore` command to list/restore from `.backup/` snapshots. Consider switching from timestamp dirs to single zip archive.

## Acceptance Criteria

- [ ] `--max-backups N` flag limits backup count (oldest pruned)
- [ ] `restore` command lists available backups
- [ ] `restore` command restores from a selected backup
- [ ] Backup format works reliably (directory or zip)
- [ ] Unit tests for backup rotation logic

## Concrete Plan

1. **Update `src/generators/backup.ts`** to add rotation:
   ```ts
   const MAX_BACKUPS_DEFAULT = 5;
   
   export async function backupExisting(
     targetPath: string,
     maxBackups: number = MAX_BACKUPS_DEFAULT,
   ): Promise<void> {
     // ... existing copy logic ...
     await pruneBackups(path.dirname(targetPath), maxBackups);
   }
   
   export async function listBackups(dir: string): Promise<string[]> {
     const backupDir = path.join(dir, '.backup');
     if (!fs.existsSync(backupDir)) return [];
     return fs.readdirSync(backupDir).sort();
   }
   
   async function pruneBackups(dir: string, max: number): Promise<void> {
     const timestamps = await listBackups(dir);
     while (timestamps.length >= max) {
       const oldest = timestamps.shift()!;
       await fs.remove(path.join(dir, '.backup', oldest));
     }
   }
   
   export async function restoreBackup(
     targetDir: string,
     backupTimestamp: string,
   ): Promise<void> {
     const backupPath = path.join(targetDir, '.backup', backupTimestamp);
     if (!fs.existsSync(backupPath)) throw new Error(`Backup not found: ${backupTimestamp}`);
     const files = fs.readdirSync(backupPath);
     for (const file of files) {
       fs.copySync(path.join(backupPath, file), path.join(targetDir, file));
     }
   }
   ```

2. **Create `src/commands/restore.ts`**:
   ```ts
   export interface RestoreOptions {
     dryRun?: boolean;
   }
   
   export async function restoreCommand(options: RestoreOptions = {}): Promise<void> {
     const docsDir = path.resolve('docs');
     const backups = await listBackups(docsDir);
     
     if (backups.length === 0) {
       logger.warn('No backups found in docs/.backup/');
       return;
     }
     
     logger.info('Available backups:');
     backups.forEach((b, i) => logger.info(`  ${i + 1}. ${b}`));
     
     // Prompt user to select a backup
     // Confirm before restoring
     // Copy files from selected backup
   }
   ```

3. **Add `--max-backups` flag** in `src/cli.ts` (on `generate` command):
   ```ts
   .option('--max-backups <number>', 'maximum number of backups to keep (default: 5)')
   ```

4. **Add `restore` command** in `src/cli.ts`.

5. **Add `--max-backups` pass-through** in `file-generator.ts` call to `backupExisting()`.

## Files

- `src/generators/backup.ts`
- `src/commands/restore.ts` (new)
- `src/cli.ts`
