# F1 — Default package manager to `npm`

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 5 min

## Problem

12 of 14 presets hardcode `packageManager: 'yarn'`. npm is more universal and the default for Node.js. Only `ai-claude`, `ai-cursor`, and `ai-codex` presets already use `npm`.

## Task

Change preset defaults from `yarn` to `npm`. The `--detect` flag already auto-detects from lockfiles, so this only affects fresh preset usage.

## Acceptance Criteria

- [ ] All presets default to `"npm"` instead of `"yarn"`
- [ ] `--detect` still correctly uses lockfile-based detection (no change needed — `scanner.ts` `detectPackageManager` already reads lockfiles)
- [ ] Tests pass

## Concrete Plan

1. Edit `src/presets/nextjs.ts` — change `packageManager: 'yarn'` → `'npm'`
2. Edit `src/presets/nextjs-saas.ts` — same
3. Edit `src/presets/vue.ts` — same
4. Edit `src/presets/angular.ts` — same
5. Edit `src/presets/express.ts` — same
6. Edit `src/presets/nestjs.ts` — same
7. Edit `src/presets/mern.ts` — same
8. Edit `src/presets/firebase.ts` — same
9. Edit `src/presets/react-firebase.ts` — same
10. Edit `src/presets/t3.ts` — same
11. Edit `src/presets/fastapi.ts` — same
12. Update `tests/template-engine.test.ts` — change `standardConfig.packageManager` from `'yarn'` to `'npm'` (line 19)
13. Update `tests/template-engine.test.ts` — change `minimalConfig.packageManager` from `'yarn'` to `'npm'` (line 30)
14. Run `npm test` to verify all tests pass

## Files

`src/presets/*.ts` (12 files), `tests/template-engine.test.ts`
