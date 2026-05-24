# F14 — Programmatic Node.js API

**Tier:** 3 — High Impact, High Effort  
**Effort:** 2-3 hours

## Problem

`main` in package.json points to `dist/cli.js`. No documented API for programmatic use.

## Task

Add `"exports"` map with `"."` for API entry point. Create `src/index.ts` exporting public API. Add JSDoc to all public exports. Document in README.

## Acceptance Criteria

- [ ] `package.json` has `"exports"` field with `"."` entry point
- [ ] `src/index.ts` exports: `generateDocs()`, `loadPreset()`, `scanProject()`, etc.
- [ ] All public exports have JSDoc
- [ ] README includes programmatic usage examples
- [ ] TypeScript types are exported for consumers

## Files

- `src/index.ts` (new)
- `package.json`
- README
