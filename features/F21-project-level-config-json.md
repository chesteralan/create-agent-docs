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

## Concrete Plan

**Note:** This significantly overlaps with F7. Consider merging both into a single config loader.

1. **In `src/utils/config-loader.ts`** (created in F7), add second detection path:
   ```ts
   const CONFIG_VARIANTS = [
     '.create-agent-docsrc',
     '.create-agent-docsrc.json',
     'create-agent-docs.json',  // without dot prefix
   ];
   ```

2. **Merge behavior**: config files cascade with priority:
   - `.create-agent-docsrc` (per-project local config, highest file priority)
   - `create-agent-docs.json` (project-level config, lower file priority)
   - CLI flags override both
   - Config files override preset defaults

3. **Optionally validate** against a JSON schema (`create-agent-docs-schema.json`) for better error messages.

## Files

- `src/utils/config-loader.ts`
- `src/commands/generate.ts`
