# F4 — Improve `--fix` in validate to use placeholders

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 10 min

## Problem

`--fix` replaces `{{unsetVar}}` with empty string, leaving broken Markdown.

## Task

Replace unset variables with `__MISSING__` or `[UNSET: variableName]` instead of empty string.

## Acceptance Criteria

- [ ] `--fix` produces valid Markdown with visible placeholders
- [ ] Placeholder format clearly indicates a missing variable name
- [ ] No empty-string substitutions

## Files

`src/commands/validate.ts`
