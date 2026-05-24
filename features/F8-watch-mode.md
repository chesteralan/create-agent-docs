# F8 — Watch mode for template development

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 2-3 hours

## Problem

No way to auto-re-generate docs when templates or config change.

## Task

Add `--watch` flag to `generate` that watches template directory and re-runs `generateDocs` on change.

## Acceptance Criteria

- [x] `--watch` flag available on `generate` command
- [x] Watches template directory for file changes
- [x] Re-runs `generateDocs` automatically on change
- [x] Debounces rapid successive changes
- [x] Graceful shutdown on SIGINT/SIGTERM
- [x] Clear console feedback when re-generating

## Concrete Plan

1. **Create `src/utils/watcher.ts`** (no `chokidar` needed — `fs.watch` with `recursive` works on Node >=18):
   ```ts
   import fs from 'fs';
   
   export function createWatcher(
     watchDir: string,
     onChange: (event: string, file: string) => void
   ): fs.FSWatcher {
     const watcher = fs.watch(watchDir, { recursive: true }, (event, filename) => {
       if (filename && filename.endsWith('.hbs')) {
         onChange(event, filename);
       }
     });
     return watcher;
   }
   ```

2. **In `src/generators/template-engine.ts`**, export `clearTemplateCache()` (already exists, just make sure it's exported).

3. **In `src/commands/generate.ts`**, add watch mode support:
   ```ts
   if (options.watch) {
     const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../templates');
     const watcher = createWatcher(TEMPLATE_DIR, async (event, file) => {
       logger.info(`Template changed: ${file} (${event}), re-generating...`);
       clearTemplateCache();
       spinner.start('Re-generating...');
       await generateDocs(config, generateOpts);
       spinner.succeed('Re-generation complete');
     });
     
     process.on('SIGINT', () => {
       watcher.close();
       process.exit(0);
     });
     
     // Keep alive
     await new Promise(() => {});
   }
   ```

4. **Add debounce** (300ms) to avoid rapid re-renders on batch saves.

5. **Add `--watch` flag** in `src/cli.ts`:
   ```ts
   .option('-w, --watch', 'watch templates and auto-re-generate on change')
   ```

## Files

- `src/utils/watcher.ts` (new)
- `src/commands/generate.ts`
- `src/cli.ts`
