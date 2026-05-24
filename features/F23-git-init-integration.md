# F23 — Git init integration (`--git`)

**Tier:** 5 — Lower Priority  
**Effort:** 1 hour

## Problem

No `git init` integration during initialization.

## Task

Add `--git` flag that runs `git init` and creates a `.gitignore` during init.

## Acceptance Criteria

- [ ] `--git` flag initializes git repository
- [ ] `.gitignore` created with sensible defaults
- [ ] No-op if already a git repo

## Files

`src/generators/file-generator.ts` or new `src/utils/git.ts`
