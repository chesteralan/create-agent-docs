# F28 — `upgrade --diff` to see template changes

**Tier:** 5 — Lower Priority  
**Effort:** 2 hours

## Problem

No way to see what changed between template versions before upgrading.

## Task

Add `upgrade --diff` that shows template changes between versions.

## Acceptance Criteria

- [ ] `upgrade --diff` compares current vs new templates
- [ ] Output shows additions, changes, removals
- [ ] Works without upgrading (read-only)

## Concrete Plan

1. **In `src/commands/upgrade.ts`**, add `--diff` flag handling:
   ```ts
   if (options.diff) {
     const currentTemplates = readBundledTemplates();
     const latestTemplates = await downloadLatestTemplates();
     
     if (!latestTemplates) {
       logger.warn('Could not fetch latest templates');
       return;
     }
     
     for (const [name, currentContent] of Object.entries(currentTemplates)) {
       const latestContent = latestTemplates[name];
       if (!latestContent) {
         logger.info(`[removed] ${name}`);
         continue;
       }
       if (currentContent !== latestContent) {
         logger.info(`[changed] ${name}`);
         // Show diff lines (simplified)
         const currentLines = currentContent.split('\n');
         const latestLines = latestContent.split('\n');
         // Print a simple +/- diff
       }
     }
     return;
   }
   ```

2. **Fetch latest templates** either from:
   - Git (compare against origin/main for bundled templates)
   - npm (download latest package and extract templates)
   - Or simply compare with a snapshot of templates stored at build time

3. **Output format**: simple `+/-` lines per changed file, or use a library like `diff`.

## Files

- `src/commands/upgrade.ts`
