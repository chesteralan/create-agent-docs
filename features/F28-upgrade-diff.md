# F28 — `upgrade --diff` to see template changes

**Tier:** 5 — Lower Priority  
**Effort:** 2 hours

## Problem

No way to see what changed between template versions before upgrading.

## Task

Add `upgrade --diff` that shows template changes between versions.

## Acceptance Criteria

- [ ] `upgrade --diff` compares current vs new templates
- [ ] Output shows additions, changes, removals
- [ ] Works without upgrading (read-only)

## Files

`src/commands/upgrade.ts`
