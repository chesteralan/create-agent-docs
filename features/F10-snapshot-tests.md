# F10 — Snapshot tests for template output

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 1-2 hours

## Problem

No regression protection for template changes. The `examples/` dir has output but no automated comparison.

## Task

Add Vitest snapshot tests (`toMatchSnapshot()`) for each preset render. CI would catch unintended template changes.

## Acceptance Criteria

- [ ] Snapshot tests exist for all presets
- [ ] Tests render templates and match against stored snapshots
- [ ] CI fails on unintended template changes
- [ ] Snapshot updates documented in CONTRIBUTING guide
- [ ] Tests pass on current output

## Files

`tests/template-engine.test.ts` (extend with snapshot cases)
