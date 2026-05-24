# F21 — `create-agent-docs.json` project-level config

**Tier:** 5 — Lower Priority  
**Effort:** 3 hours

## Problem

No JSON-based project-level config (separate from `.create-agent-docsrc`).

## Task

Support `create-agent-docs.json` auto-loaded from project root with preset, output dir, flags, and custom template paths.

## Acceptance Criteria

- [ ] `create-agent-docs.json` auto-detected in project root
- [ ] Config fields: preset, output directory, flags, template paths
- [ ] CLI flags override config values
- [ ] JSON schema validation

## Files

- `src/utils/config-loader.ts`
- `src/commands/generate.ts`
