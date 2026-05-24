# F26 — Non-TTY CI mode (no spinners, clean output)

**Tier:** 5 — Lower Priority  
**Effort:** 1 hour

## Problem

Spinners and fancy output don't work well in CI environments.

## Task

Detect CI environment, use logger instead of `ora` for clean output.

## Acceptance Criteria

- [x] CI env auto-detected (CI env vars, non-TTY)
- [x] No spinners when in CI mode
- [x] Clean, parseable output for CI logs
- [x] `--no-spinner` flag to force non-spinner mode

## Concrete Plan

1. **Add CI detection** to `src/utils/logger.ts`:
   ```ts
   export function isCI(): boolean {
     return process.env.CI === 'true' ||
            process.env.CI === '1' ||
            !process.stdout.isTTY;
   }
   ```

2. **Add `--no-spinner` flag** in `src/cli.ts`:
   ```ts
   .option('--no-spinner', 'disable spinners (useful for CI)')
   ```

3. **In `src/generators/file-generator.ts`**, conditionally use spinner:
   ```ts
   import { isCI } from '../utils/logger.js';
   
   const useSpinner = !isCI() && !options.noSpinner;
   
   const spinner = useSpinner
     ? ora({ text: 'Generating...', color: 'blue' }).start()
     : null;
   
   // Replace spinner.text = ... with logger.info(...) when in CI
   if (useSpinner) {
     spinner!.text = `Processing ${relPath}...`;
   } else {
     logger.info(`Processing ${relPath}...`);
   }
   ```

4. **Handle spinner stop/start** — replace with direct logger calls:
   ```ts
   if (useSpinner) {
     spinner!.succeed(`Created: ${relPath}`);
   } else {
     logger.success(`Created: ${relPath}`);
   }
   ```

## Files

- `src/utils/logger.ts`
- `src/cli.ts`
- `src/generators/file-generator.ts`
