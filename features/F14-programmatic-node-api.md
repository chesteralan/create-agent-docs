# F14 — Programmatic Node.js API

**Tier:** 3 — High Impact, High Effort  
**Effort:** 2-3 hours

## Problem

`main` in package.json points to `dist/cli.js`. No documented API for programmatic use.

## Task

Add `"exports"` map with `"."` for API entry point. Create `src/index.ts` exporting public API. Add JSDoc to all public exports. Document in README.

## Acceptance Criteria

- [x] `package.json` has `"exports"` field with `"."` entry point
- [x] `src/index.ts` exports: `generateDocs()`, `loadPreset()`, `scanProject()`, etc.
- [x] All public exports have JSDoc
- [x] README includes programmatic usage examples
- [x] TypeScript types are exported for consumers

## Concrete Plan

1. **Create `src/index.ts`**:
   ```ts
   /** Generate documentation files for a project */
   export { generateDocs } from './generators/file-generator.js';
   export type { GenerateOptions } from './generators/file-generator.js';
   
   /** Load a preset config by name or file path */
   export { loadPreset, listPresets } from './utils/preset.js';
   export type { PresetInfo } from './utils/preset.js';
   
   /** Scan a project to detect its tech stack */
   export { scanProject, scanResultToConfig } from './analyzers/scanner.js';
   export type { ScanResult } from './analyzers/scanner.js';
   
   /** Render a Handlebars template with context */
   export { renderTemplate, clearTemplateCache } from './generators/template-engine.js';
   
   /** Interactive prompts for project config */
   export { promptProjectConfig } from './prompts/index.js';
   
   /** Backup utility functions */
   export { backupExisting } from './generators/backup.js';
   
   /** Types */
   export type {
     ProjectConfig,
     AiAgent,
   } from './types/index.js';
   ```

2. **Update `package.json`**:
   ```json
   {
     "main": "./dist/index.js",
     "exports": {
       ".": {
         "import": "./dist/index.js",
         "types": "./dist/index.d.ts"
       },
       "./cli": {
         "import": "./dist/cli.js"
       }
     },
     "types": "./dist/index.d.ts"
   }
   ```

3. **Update `tsup.config.ts`** to build both entry points:
   ```ts
   import { defineConfig } from 'tsup';
   
   export default defineConfig({
     entry: ['src/index.ts', 'src/cli.ts'],
     format: 'esm',
     dts: true,
     clean: true,
   });
   ```

4. **Add JSDoc** to all top-level exports (most already have good comments — add where missing).

5. **Update README** with:
   ```md
   ## Programmatic Usage
   
   ```ts
   import { generateDocs, loadPreset, scanProject } from 'create-agent-docs';
   
   // Use a preset
   const config = await loadPreset('nextjs');
   await generateDocs(config, { targetDir: './my-project' });
   
   // Auto-detect
   const scan = scanProject('./my-project');
   const config = scanResultToConfig(scan);
   await generateDocs(config);
   ```
   ```

## Files

- `src/index.ts` (new)
- `package.json`
- `tsup.config.ts`
- `README.md`
