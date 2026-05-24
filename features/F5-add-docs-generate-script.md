# F5 — Offer to add `docs:generate` script to package.json

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 20 min

## Problem

After generating docs, there's no easy way to re-run. No package.json script is created.

## Task

After `generateDocs()`, prompt the user: "Add `docs:generate` script to package.json?" and append it if accepted.

## Acceptance Criteria

- [ ] Prompt appears after successful generation
- [ ] If accepted, `"docs:generate": "create-agent-docs generate"` is added to `package.json`
- [ ] Handles missing `package.json` gracefully
- [ ] Script is idempotent (does not duplicate)

## Files

`src/generators/file-generator.ts`
