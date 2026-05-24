# F1 — Default package manager to `npm`

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 5 min

## Problem

12 of 14 presets hardcode `packageManager: 'yarn'`. npm is more universal and the default for Node.js.

## Task

Change preset defaults from `yarn` to `npm`. The `--detect` flag already auto-detects from lockfiles, so this only affects fresh preset usage.

## Acceptance Criteria

- [ ] All presets default to `"npm"` instead of `"yarn"`
- [ ] `--detect` still correctly uses lockfile-based detection
- [ ] Tests pass

## Files

`src/presets/*.ts` (12 files)
