# F27 — Template partials per-stack

**Tier:** 5 — Lower Priority  
**Effort:** 2 hours

## Problem

No stack-specific partials for reusable template fragments.

## Task

Create stack-specific Handlebars partials (Firebase, Next.js, etc.) for reusable documentation fragments.

## Acceptance Criteria

- [x] Stack-specific partials registered in Handlebars
- [x] Partials loaded based on detected/selected stack
- [x] Templates can reference `{{> stackPartial}}`

## Concrete Plan

1. **Create stack partial directory** `src/templates/partials/stack/`:
   - `nextjs.hbs` — Next.js-specific documentation snippets
   - `firebase.hbs` — Firebase-specific snippets
   - `react-vite.hbs` — React + Vite snippets
   - `express.hbs` — Express backend snippets

2. **Update `src/generators/template-engine.ts`** `loadPartials()`:
   ```ts
   function loadStackPartials(stackType: string): void {
     const stackDir = path.join(PARTIALS_DIR, 'stack');
     const stackFile = path.join(stackDir, `${stackType}.hbs`);
     if (fs.existsSync(stackFile)) {
       const content = fs.readFileSync(stackFile, 'utf8');
       Handlebars.registerPartial(`stack-${stackType}`, content);
     }
   }
   ```

3. **Pass stack context** in `renderTemplate()` via the `loadStackPartials` being called from `file-generator.ts` based on `config.frontendFramework` / `config.backend`.

4. **Update existing templates** to use partials where stack-specific content varies (e.g., `{{> stack-nextjs}}`).

## Files

- `src/templates/partials/stack/` (new directory)
- `src/generators/template-engine.ts`
