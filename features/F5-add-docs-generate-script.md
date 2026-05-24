# F5 — Offer to add `docs:generate` script to package.json

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 20 min

## Problem

After generating docs, there's no easy way to re-run. No package.json script is created. `printSummary()` in `file-generator.ts` is called after all files are generated, but no follow-up actions are taken.

## Task

After `generateDocs()`, prompt the user: "Add `docs:generate` script to package.json?" and append it if accepted.

## Acceptance Criteria

- [ ] Prompt appears after successful generation
- [ ] If accepted, `"docs:generate": "create-agent-docs generate"` is added to `package.json`
- [ ] Handles missing `package.json` gracefully
- [ ] Script is idempotent (does not duplicate)

## Concrete Plan

1. **In `src/generators/file-generator.ts`**, after `printSummary()`, add:
   ```ts
   if (!options.dryRun) {
     await offerDocsScript(targetDir);
   }
   ```

2. **Add helper function** in the same file:
   ```ts
   import { confirm } from '@inquirer/prompts';
   
   async function offerDocsScript(projectDir: string): Promise<void> {
     const pkgPath = path.join(projectDir, 'package.json');
     if (!fs.existsSync(pkgPath)) return;
     
     let pkg: Record<string, any>;
     try {
       pkg = fs.readJsonSync(pkgPath);
     } catch {
       return; // invalid JSON, skip
     }
     
     if (pkg.scripts?.['docs:generate']) return; // idempotent
     
     let answer = false;
     if (process.stdout.isTTY) {
       spinner.stop();
       answer = await confirm({
         message: 'Add "docs:generate" script to package.json?',
         default: false,
       });
       spinner.start();
     }
     
     if (answer) {
       pkg.scripts = pkg.scripts || {};
       pkg.scripts['docs:generate'] = 'create-agent-docs generate';
       fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
       logger.success('Added "docs:generate" script to package.json');
     }
   }
   ```

## Files

- `src/generators/file-generator.ts`
