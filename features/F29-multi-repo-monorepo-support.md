# F29 — Multi-repo / monorepo support

**Tier:** 5 — Lower Priority  
**Effort:** 4 hours

## Problem

No support for generating docs across multiple packages in a monorepo.

## Task

Add support for monorepo workspaces, generating docs per-package with shared config.

## Acceptance Criteria

- [ ] Detects monorepo workspaces (npm/yarn/pnpm workspaces, lerna, nx, turborepo)
- [ ] Generates docs per-package
- [ ] Shared root-level config applies to all packages
- [ ] Per-package overrides supported

## Files

- `src/utils/monorepo.ts` (new)
- `src/commands/generate.ts`
