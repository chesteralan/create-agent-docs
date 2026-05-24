# F22 — Project scaffolding (`--scaffold src/`)

**Tier:** 5 — Lower Priority  
**Effort:** 4 hours

## Problem

No way to create basic project structure alongside docs.

## Task

Add `--scaffold src/` flag that creates a basic project directory structure with placeholder files.

## Acceptance Criteria

- [x] `--scaffold <dir>` creates basic project structure
- [x] Placeholder files created in specified directory
- [x] Integrates with existing generation flow

## Concrete Plan

1. **In `src/generators/file-generator.ts`**, add a `scaffoldProject()` function:
   ```ts
   async function scaffoldProject(scaffoldDir: string): Promise<void> {
     const dirs = [
       'src/components',
       'src/pages',
       'src/utils',
       'src/styles',
       'src/api',
     ];
     
     for (const d of dirs) {
       fs.ensureDirSync(path.join(scaffoldDir, d));
     }
     
     // Create placeholders
     const placeholders = {
       'src/index.js': '// Main entry point\n',
       'src/utils/helpers.js': '// Utility functions\n',
       'src/styles/main.css': '/* Main stylesheet */\n',
     };
     
     for (const [file, content] of Object.entries(placeholders)) {
       const filePath = path.join(scaffoldDir, file);
       if (!fs.existsSync(filePath)) {
         fs.writeFileSync(filePath, content);
       }
     }
     
     logger.success(`Scaffolded project structure in ${scaffoldDir}`);
   }
   ```

2. **In `generateDocs()`**, call `scaffoldProject()` when `--scaffold` is provided:
   ```ts
   if (options.scaffold) {
     await scaffoldProject(options.scaffold);
   }
   ```

3. **Add `--scaffold <dir>` flag** in `src/cli.ts`:
   ```ts
   .option('--scaffold <dir>', 'create basic project structure')
   ```

## Files

- `src/generators/file-generator.ts`
- `src/cli.ts`
