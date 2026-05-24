# F3 — Add `--no-color` / `NO_COLOR` support

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 20 min

## Problem

No way to disable chalk colors for CI or non-TTY terminals.

## Task

Check `process.env.NO_COLOR` and `--no-color` flag in CLI, pass to logger.

## Acceptance Criteria

- [ ] `--no-color` flag disables chalk output
- [ ] `NO_COLOR` environment variable is respected
- [ ] Works in CI environments

## Files

- `src/cli.ts`
- `src/utils/logger.ts`
