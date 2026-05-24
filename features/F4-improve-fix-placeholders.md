# F4 — Improve `--fix` in validate to use placeholders

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 10 min

## Problem

`src/commands/validate.ts:50` does:
```ts
const fixed = content.replace(UNSUBSTITUTED_PATTERN, '');
```
This replaces `{{unsetVar}}` with empty string, leaving broken Markdown artifacts.

## Task

Replace unset variables with `__MISSING__` or `[UNSET: variableName]` instead of empty string.

## Acceptance Criteria

- [ ] `--fix` produces valid Markdown with visible placeholders
- [ ] Placeholder format clearly indicates a missing variable name
- [ ] No empty-string substitutions

## Concrete Plan

1. **Update regex** in `src/commands/validate.ts` to use a capture group:
   ```ts
   const UNSUBSTITUTED_PATTERN = /\{\{([^}]+)\}\}/g;
   ```

2. **Update fix logic** on line 50:
   ```ts
   const fixed = content.replace(
     UNSUBSTITUTED_PATTERN,
     (match, varName) => `*[UNSET: ${varName.trim()}]*`
   );
   ```
   This produces `*[UNSET: variableName]*` which renders as italic in Markdown — clearly visible and not broken.

3. **Update log message** on line 51 from `"removed N unsubstituted variables"` to `"replaced N unsubstituted variables with placeholders"`.

## Files

- `src/commands/validate.ts`
