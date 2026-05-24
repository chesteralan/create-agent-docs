# F16 — Template versioning and migration

**Tier:** 4 — Medium Impact, High Effort  
**Effort:** 4-6 hours

## Problem

Old generated docs have no upgrade path when templates change between CLI versions. `upgrade` command doesn't touch generated output.

## Task

Embed template version in generated files. `upgrade --migrate` diffs old vs new templates and applies changes, preserving user edits where possible.

## Acceptance Criteria

- [ ] Template version embedded in generated files (frontmatter or comment)
- [ ] `upgrade --migrate` compares old vs new templates
- [ ] Changes applied with user edit preservation
- [ ] Migration dry-run mode available
- [ ] Tests for migration scenarios

## Files

- `src/commands/upgrade.ts`
- New migration engine
