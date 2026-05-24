# F26 — Non-TTY CI mode (no spinners, clean output)

**Tier:** 5 — Lower Priority  
**Effort:** 1 hour

## Problem

Spinners and fancy output don't work well in CI environments.

## Task

Detect CI environment, use logger instead of `ora` for clean output.

## Acceptance Criteria

- [ ] CI env auto-detected (CI env vars, non-TTY)
- [ ] No spinners when in CI mode
- [ ] Clean, parseable output for CI logs
- [ ] `--no-spinner` flag to force non-spinner mode

## Files

- `src/utils/logger.ts`
- `src/cli.ts`
