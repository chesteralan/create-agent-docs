# F13 — Backup rotation and restore command

**Tier:** 3 — High Impact, High Effort  
**Effort:** 3-4 hours

## Problem

Multiple overwrites create unlimited `.backup/` dirs with no cleanup or restore capability.

## Task

Add `--max-backups N` to prune old backups. Add `restore` command to list/restore from `.backup/` snapshots. Consider switching from timestamp dirs to single zip archive.

## Acceptance Criteria

- [ ] `--max-backups N` flag limits backup count (oldest pruned)
- [ ] `restore` command lists available backups
- [ ] `restore` command restores from a selected backup
- [ ] Backup format works reliably (directory or zip)
- [ ] Unit tests for backup rotation logic

## Files

- `src/commands/restore.ts` (new)
- `src/generators/backup.ts`
