# F9 — `.gitignore` management

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 1 hour

## Problem

The tool creates `.backup/` dirs but doesn't add them to `.gitignore`. Generated `docs/` may or may not want to be committed.

## Task

Offer to append `.backup/` to `.gitignore`. Offer to add/remove `docs/` from `.gitignore` based on user preference.

## Acceptance Criteria

- [x] User prompted to add `.backup/` to `.gitignore`
- [x] User prompted whether `docs/` should be in `.gitignore`
- [x] Creates `.gitignore` if it doesn't exist
- [x] No duplicate entries added
- [x] Existing `.gitignore` entries are respected

## Concrete Plan

1. **Create `src/utils/gitignore.ts`**:
   ```ts
   import fs from 'fs-extra';
   import path from 'path';
   
   export function ensureGitignoreEntry(dir: string, entry: string): boolean {
     const gitignorePath = path.join(dir, '.gitignore');
     let content = '';
     
     if (fs.existsSync(gitignorePath)) {
       content = fs.readFileSync(gitignorePath, 'utf8');
       const lines = content.split('\n').map(l => l.trim());
       if (lines.includes(entry)) return false; // already present
     }
     
     content += (content.endsWith('\n') ? '' : '\n') + entry + '\n';
     fs.writeFileSync(gitignorePath, content);
     return true;
   }
   ```

2. **In `src/generators/file-generator.ts`**, after generation + backup logic, prompt user:
   ```ts
   if (!options.dryRun && process.stdout.isTTY) {
     const addBackup = await confirm({
       message: 'Add .backup/ to .gitignore?',
       default: true,
     });
     if (addBackup) {
       ensureGitignoreEntry(targetDir, '.backup/');
       logger.success('Added .backup/ to .gitignore');
     }
     
     const addDocs = await confirm({
       message: 'Should docs/ be added to .gitignore? (N = commit docs to repo)',
       default: false,
     });
     if (addDocs) {
       ensureGitignoreEntry(targetDir, 'docs/');
       logger.success('Added docs/ to .gitignore');
     }
   }
   ```

3. **Add tests** in `tests/gitignore.test.ts`:
   - Create temp dir with no `.gitignore`, call `ensureGitignoreEntry`, verify file created with correct content
   - Call again with same entry, verify no duplicate

## Files

- `src/utils/gitignore.ts` (new)
- `src/generators/file-generator.ts`
- `tests/gitignore.test.ts` (new)
