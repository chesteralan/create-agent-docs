# F16 — Template versioning and migration

**Tier:** 4 — Medium Impact, High Effort  
**Effort:** 4-6 hours

## Problem

Old generated docs have no upgrade path when templates change between CLI versions. `upgrade` command doesn't touch generated output.

## Task

Embed template version in generated files. `upgrade --migrate` diffs old vs new templates and applies changes, preserving user edits where possible.

## Acceptance Criteria

- [x] Template version embedded in generated files (frontmatter or comment)
- [x] `upgrade --migrate` compares old vs new templates
- [x] Changes applied with user edit preservation
- [x] Migration dry-run mode available
- [x] Tests for migration scenarios

## Concrete Plan

1. **Add version frontmatter** to generated files in `src/generators/file-generator.ts`:
   ```ts
   const versionedContent = `<!-- template-version: ${getCliVersion()} -->\n\n${rendered}`;
   ```

2. **Create migration engine** `src/utils/migration.ts`:
   ```ts
   export interface MigrationDiff {
     file: string;
     type: 'added' | 'removed' | 'changed';
     oldContent?: string;
     newContent?: string;
   }
   
   export function diffTemplates(oldContent: string, newContent: string): MigrationDiff[] {
     // Parse out version frontmatter
     // Simple line-by-line diff
     // Return list of changes
   }
   
   export function applyMigration(content: string, diff: MigrationDiff[]): string {
     // Apply diffs while trying to preserve user edits
     // Uses 3-way merge: old template <-> user version <-> new template
   }
   ```

3. **Update `src/commands/upgrade.ts`**:
   - Scan `docs/` for all generated files
   - Extract version from frontmatter
   - If version < current, get old template from git history or bundled cache
   - If `--migrate`, apply diffs
   - If `--dry-run`, show what would change without applying

4. **Add `--migrate` and `--diff` flags** to `upgrade` command in `src/cli.ts`.

5. **Bundle template versions** — store a copy of current template content at build time (or compare against git-tracked templates).

## Files

- `src/commands/upgrade.ts`
- `src/utils/migration.ts` (new)
- `src/generators/file-generator.ts`
- `src/cli.ts`
