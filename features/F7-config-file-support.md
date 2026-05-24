# F7 — Config file support (`.create-agent-docsrc`)

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 1-2 hours

## Problem

No automatic project-level config. Users must pass `--preset ./config.json` every time.

## Task

Auto-detect `.create-agent-docsrc` (JSON/YAML) in project root. Can store preset name, output dir, flags, and custom template paths.

## Acceptance Criteria

- [ ] `.create-agent-docsrc` is auto-detected in project root
- [ ] Supports JSON and YAML formats
- [ ] Config can specify: preset name, output directory, flags, custom template paths
- [ ] CLI flags override config file values
- [ ] Config file values override preset defaults
- [ ] No breaking changes to existing usage

## Files

- `src/utils/config-loader.ts` (new)
- `src/commands/generate.ts`
