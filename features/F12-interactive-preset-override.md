# F12 — Interactive preset override mode

**Tier:** 3 — High Impact, High Effort  
**Effort:** 1-2 hours

## Problem

`--preset` skips ALL prompts. No way to use a preset as a base and override a few fields interactively.

## Task

Add `--preset nextjs --interactive` that loads preset values but still runs prompts, pre-filled with preset values.

## Acceptance Criteria

- [ ] `--interactive` flag available alongside `--preset`
- [ ] Prompts pre-filled with preset values as defaults
- [ ] User can accept defaults or override specific fields
- [ ] Works with all existing presets
- [ ] No breaking changes to `--preset` without `--interactive`

## Concrete Plan

1. **In `src/commands/generate.ts`**, the critical section is lines 47-55:
   ```ts
   let presetConfig: Partial<ProjectConfig> | undefined;
   if (options.preset) {
     presetConfig = await loadPreset(options.preset);
     if (presetConfig) {
       logger.info(`[preset] Using "${options.preset}" preset – skipping interactive prompts.`);
     } else {
       logger.warn(`Preset "${options.preset}" not found – falling back to interactive prompts.`);
     }
   }
   const config = await promptProjectConfig(presetConfig);
   ```
   
   The key change: when `--interactive` is passed, always run prompts even if preset is loaded:
   ```ts
   if (options.preset && !options.interactive) {
     // Skip prompts (current behavior)
     const config = { ...defaultConfig, ...presetConfig } as ProjectConfig;
     await generateDocs(config, ...);
     return;
   }
   
   // Interactive mode (or no preset): run prompts with preset values as defaults
   const config = await promptProjectConfig(presetConfig);
   await generateDocs(config, ...);
   ```

2. **No changes needed in `prompts/index.ts`** — it already uses `overrides.field ?? await prompt(...)` pattern. When `--interactive` passes preset values as overrides, they become default selections.

3. **Add `--interactive` flag** in `src/cli.ts`:
   ```ts
   .option('-i, --interactive', 'run prompts interactively even with --preset')
   ```

4. **Update tests** in `tests/preset.test.ts` to verify `--preset nextjs --interactive` still runs prompts and values can be overridden.

## Files

- `src/commands/generate.ts`
- `src/cli.ts`
- `tests/preset.test.ts`
