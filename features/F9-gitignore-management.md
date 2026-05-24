# F9 — `.gitignore` management

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 1 hour

## Problem

The tool creates `.backup/` dirs but doesn't add them to `.gitignore`. Generated `docs/` may or may not want to be committed.

## Task

Offer to append `.backup/` to `.gitignore`. Offer to add/remove `docs/` from `.gitignore` based on user preference.

## Acceptance Criteria

- [ ] User prompted to add `.backup/` to `.gitignore`
- [ ] User prompted whether `docs/` should be in `.gitignore`
- [ ] Creates `.gitignore` if it doesn't exist
- [ ] No duplicate entries added
- [ ] Existing `.gitignore` entries are respected

## Files

- `src/generators/file-generator.ts`
- Or new `src/utils/gitignore.ts`
