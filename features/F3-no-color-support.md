# F3 — Add `--no-color` / `NO_COLOR` support

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 20 min

## Problem

No way to disable chalk colors for CI or non-TTY terminals. `src/utils/logger.ts` uses `chalk.blue`, `chalk.green`, etc. directly with no color-disabling mechanism.

## Task

Check `process.env.NO_COLOR` and `--no-color` flag in CLI, pass to logger.

## Acceptance Criteria

- [x] `--no-color` flag disables chalk output
- [x] `NO_COLOR` environment variable is respected
- [x] Works in CI environments

## Concrete Plan

1. **Create `src/utils/no-color.ts`** (imported early before any chalk usage):
   ```ts
   import chalk from 'chalk';
   
   export function initNoColor(): void {
     const hasNoColorFlag = process.argv.includes('--no-color');
     const hasNoColorEnv = process.env.NO_COLOR !== undefined;
     if (hasNoColorFlag || hasNoColorEnv) {
       chalk.level = 0;
     }
   }
   ```

2. **In `src/cli.ts`**, add `--no-color` option:
   ```ts
   .option('--no-color', 'disable colored output')
   ```
   Also call `initNoColor()` at the very top of the file (before `printBanner()` which uses chalk):
   ```ts
   import { initNoColor } from './utils/no-color.js';
   initNoColor();
   ```

3. **In `src/utils/logger.ts`**, no changes needed — chalk level is set globally.

4. **Update tests** if needed — ensure `NO_COLOR` env var suppresses colors.

## Files

- `src/utils/no-color.ts` (new)
- `src/cli.ts`
