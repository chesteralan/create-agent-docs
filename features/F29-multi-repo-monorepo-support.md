# F29 — Multi-repo / monorepo support

**Tier:** 5 — Lower Priority  
**Effort:** 4 hours

## Problem

No support for generating docs across multiple packages in a monorepo.

## Task

Add support for monorepo workspaces, generating docs per-package with shared config.

## Acceptance Criteria

- [x] Detects monorepo workspaces (npm/yarn/pnpm workspaces, lerna, nx, turborepo)
- [x] Generates docs per-package
- [x] Shared root-level config applies to all packages
- [x] Per-package overrides supported

## Concrete Plan

1. **Create `src/utils/monorepo.ts`**:
   ```ts
   import fs from 'fs-extra';
   import path from 'path';
   
   export interface MonorepoPackage {
     name: string;
     path: string;
     packageJson: Record<string, any>;
   }
   
   export function detectMonorepo(dir: string): MonorepoPackage[] | null {
     const pkgPath = path.join(dir, 'package.json');
     if (!fs.existsSync(pkgPath)) return null;
     
     const pkg = fs.readJsonSync(pkgPath);
     const workspaces = pkg.workspaces;
     if (!workspaces) return null;
     
     const packages: MonorepoPackage[] = [];
     for (const pattern of workspaces) {
       // Resolve glob pattern to actual directories
       // Read each package.json
       // Push to packages array
     }
     
     return packages.length > 0 ? packages : null;
   }
   ```

2. **In `src/commands/generate.ts`**, if monorepo detected:
   - Ask user which packages to generate docs for
   - Use root config as base
   - Allow per-package overrides via `package.json` field `"create-agent-docs": { ... }`
   - Run `generateDocs()` for each selected package

3. **Support per-package config** via `package.json`:
   ```json
   {
     "name": "my-package",
     "create-agent-docs": {
       "output": "docs",
       "preset": "express"
     }
   }
   ```

## Files

- `src/utils/monorepo.ts` (new)
- `src/commands/generate.ts`
