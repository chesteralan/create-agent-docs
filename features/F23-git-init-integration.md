# F23 — Git init integration (`--git`)

**Tier:** 5 — Lower Priority  
**Effort:** 1 hour

## Problem

No `git init` integration during initialization.

## Task

Add `--git` flag that runs `git init` and creates a `.gitignore` during init.

## Acceptance Criteria

- [x] `--git` flag initializes git repository
- [x] `.gitignore` created with sensible defaults
- [x] No-op if already a git repo

## Concrete Plan

1. **Create `src/utils/git.ts`**:
   ```ts
   import { execSync } from 'child_process';
   import fs from 'fs-extra';
   import path from 'path';
   
   export function initGitRepo(dir: string): boolean {
     if (fs.existsSync(path.join(dir, '.git'))) return false;
     execSync('git init', { cwd: dir, stdio: 'pipe' });
     return true;
   }
   
   export function createDefaultGitignore(dir: string): void {
     const gitignorePath = path.join(dir, '.gitignore');
     if (fs.existsSync(gitignorePath)) return;
     
     const defaults = [
       '# Dependencies',
       'node_modules/',
       '.pnp',
       '.pnp.js',
       '',
       '# Build outputs',
       'dist/',
       'build/',
       '.next/',
       '',
       '# Environment',
       '.env',
       '.env.local',
       '.env.*.local',
       '',
       '# IDE',
       '.vscode/',
       '.idea/',
       '*.swp',
       '*.swo',
       '',
       '# OS',
       '.DS_Store',
       'Thumbs.db',
       '',
       '# Backups',
       '.backup/',
       '',
     ].join('\n');
     
     fs.writeFileSync(gitignorePath, defaults);
   }
   ```

2. **In `src/commands/generate.ts`** or `src/commands/init.ts`, when `--git` is set:
   ```ts
   if (options.git) {
     const initialized = initGitRepo(targetDir);
     if (initialized) {
       createDefaultGitignore(targetDir);
       logger.success('Initialized git repository');
     } else {
       logger.info('Already a git repository');
     }
   }
   ```

3. **Add `--git` flag** in `src/cli.ts` on `init` and `generate` commands.

## Files

- `src/utils/git.ts` (new)
- `src/commands/generate.ts` or `src/commands/init.ts`
- `src/cli.ts`
