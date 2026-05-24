# F12 — Interactive preset override mode

**Tier:** 3 — High Impact, High Effort  
**Effort:** 1-2 hours

## Problem

`--preset` skips ALL prompts. No way to use a preset as a base and override a few fields interactively.

## Task

Add `--preset nextjs --interactive` that loads preset values but still runs prompts, pre-filled with preset values.

## Acceptance Criteria

- [ ] `--interactive` flag available alongside `--preset`
- [ ] Prompts pre-filled with preset values as defaults
- [ ] User can accept defaults or override specific fields
- [ ] Works with all existing presets
- [ ] No breaking changes to `--preset` without `--interactive`

## Files

- `src/commands/generate.ts`
- `src/prompts/index.ts`
