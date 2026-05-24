# F17 — Preset template overrides

**Tier:** 4 — Medium Impact, High Effort  
**Effort:** 3-4 hours

## Problem

Presets only supply config values. No mechanism for a preset to override a template (e.g., Next.js providing a custom `ARCHITECTURE.md.hbs`).

## Task

Allow presets to specify `templateOverrides: Record<string, string>` mapping filenames to custom template paths. `loadPreset` merges these.

## Acceptance Criteria

- [ ] Presets can specify `templateOverrides` field
- [ ] Custom template paths are relative to preset location (or absolute)
- [ ] `loadPreset` merges overrides into the template map
- [ ] Conflicting overrides warn user
- [ ] Existing presets continue to work unchanged

## Files

- `src/utils/preset.ts`
- `src/generators/file-generator.ts`
- Types updates
