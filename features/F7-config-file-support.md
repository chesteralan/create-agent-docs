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

## Concrete Plan

1. **Create `src/utils/config-loader.ts`**:
   ```ts
   import fs from 'fs-extra';
   import path from 'path';
   
   export interface ProjectConfigFile {
     preset?: string;
     output?: string;
     standard?: boolean;
     detect?: boolean;
     force?: boolean;
     dryRun?: boolean;
     yes?: boolean;
     templates?: Record<string, string>;
   }
   
   const CONFIG_VARIANTS = [
     '.create-agent-docsrc',
     '.create-agent-docsrc.json',
   ];
   
   export function loadProjectConfig(dir: string = process.cwd()): ProjectConfigFile | null {
     for (const variant of CONFIG_VARIANTS) {
       const filePath = path.join(dir, variant);
       if (fs.existsSync(filePath)) {
         try {
           const config = fs.readJsonSync(filePath) as ProjectConfigFile;
           return config;
         } catch {
           continue;
         }
       }
     }
     return null;
   }
   ```
   Skip YAML for now to avoid adding `js-yaml` dependency — can be added later.

2. **In `src/commands/generate.ts`**, at the top of `generateCommand()`, add:
   ```ts
   const fileConfig = loadProjectConfig();
   if (fileConfig) {
     logger.info(`Loaded config from ${logger.bold('.create-agent-docsrc')}`);
     // Merge: CLI > file > preset defaults
     options.preset = options.preset || fileConfig.preset;
     options.output = options.output || fileConfig.output;
     // etc.
   }
   ```

3. **Merge hierarchy**: `CLI flags > config file > preset defaults`. This means:
   - File config fills in options that weren't explicitly passed via CLI
   - Preset values are overridden by file config
   - But CLI flags always win

4. **Add tests** in `tests/config-loader.test.ts`:
   - Create temp `.create-agent-docsrc`, verify `loadProjectConfig()` returns it
   - Missing file returns `null`

## Files

- `src/utils/config-loader.ts` (new)
- `src/commands/generate.ts`
- `tests/config-loader.test.ts` (new)
