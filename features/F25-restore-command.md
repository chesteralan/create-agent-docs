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

## Files

- `src/commands/restore.ts` (new)
- `src/generators/backup.ts`
