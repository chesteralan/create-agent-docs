# F17 — Preset template overrides

**Tier:** 4 — Medium Impact, High Effort  
**Effort:** 3-4 hours

## Problem

Presets only supply config values. No mechanism for a preset to override a template (e.g., Next.js providing a custom `ARCHITECTURE.md.hbs`).

## Task

Allow presets to specify `templateOverrides: Record<string, string>` mapping filenames to custom template paths. `loadPreset` merges these.

## Acceptance Criteria

- [x] Presets can specify `templateOverrides` field
- [x] Custom template paths are relative to preset location (or absolute)
- [x] `loadPreset` merges overrides into the template map
- [x] Conflicting overrides warn user
- [x] Existing presets continue to work unchanged

## Concrete Plan

1. **Update `ProjectConfig` type** in `src/types/index.ts`:
   ```ts
   export interface ProjectConfig {
     // ... existing fields ...
     templateOverrides?: Record<string, string>;
   }
   ```

2. **Update `src/utils/preset.ts`** — `loadBuiltinPreset()` already returns `Partial<ProjectConfig>`, so `templateOverrides` flows through naturally if a preset exports it. For JSON presets, `loadJsonPreset()` already parses all fields, so it will work too.

3. **Update `src/generators/file-generator.ts`** in `generateDocs()`:
   ```ts
   const allTemplates = [...TEMPLATES, ...getAgentTemplates(config)];
   
   // Apply template overrides from preset
   if (config.templateOverrides) {
     for (const [filename, templatePath] of Object.entries(config.templateOverrides)) {
       const idx = allTemplates.findIndex(t => t.name === filename);
       if (idx >= 0) {
         // Override built-in template
         allTemplates[idx] = { ...allTemplates[idx], template: templatePath };
         logger.info(`Template override: ${filename} -> ${templatePath}`);
       } else {
         // Add new template
         allTemplates.push({ name: filename, template: templatePath });
       }
     }
   }
   ```

4. **Update template path resolution** — custom template paths should be resolved relative to the preset's directory (for JSON presets) or the preset file's location (for built-in presets).

5. **Add validation** — warn if a custom template path doesn't exist.

## Files

- `src/types/index.ts`
- `src/utils/preset.ts`
- `src/generators/file-generator.ts`
