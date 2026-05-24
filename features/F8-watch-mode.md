# F8 — Watch mode for template development

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 2-3 hours

## Problem

No way to auto-re-generate docs when templates or config change.

## Task

Add `--watch` flag to `generate` that watches template directory and re-runs `generateDocs` on change.

## Acceptance Criteria

- [ ] `--watch` flag available on `generate` command
- [ ] Watches template directory for file changes
- [ ] Re-runs `generateDocs` automatically on change
- [ ] Debounces rapid successive changes
- [ ] Graceful shutdown on SIGINT/SIGTERM
- [ ] Clear console feedback when re-generating

## Files

- `src/commands/generate.ts`
- New watch utility

## Dependencies

`chokidar` (or use built-in `fs.watch`)
