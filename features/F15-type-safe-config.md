# F15 — Type-safe config with union types

**Tier:** 3 — High Impact, High Effort  
**Effort:** 2-3 hours

## Problem

`ProjectConfig` fields are `string` instead of union types, allowing invalid values with no compile-time checking.

## Task

Define union literal types for each field. Update all presets, prompts, templates, and tests to use them.

## Acceptance Criteria

- [ ] Union types defined for all config fields (e.g., `Backend`, `Frontend`, `PackageManager`, etc.)
- [ ] All presets use the new union types
- [ ] All prompts use the new union types
- [ ] All templates use the new union types
- [ ] Scanner uses the new union types
- [ ] All tests updated and passing
- [ ] Invalid values caught at compile time

## Files

- `src/types/index.ts`
- All presets
- All tests
- Scanner
