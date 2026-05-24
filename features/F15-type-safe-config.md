# F15 — Type-safe config with union types

**Tier:** 3 — High Impact, High Effort  
**Effort:** 2-3 hours

## Problem

`ProjectConfig` fields are `string` instead of union types, allowing invalid values with no compile-time checking.

## Task

Define union literal types for each field. Update all presets, prompts, templates, and tests to use them.

## Acceptance Criteria

- [x] Union types defined for all config fields
- [x] All presets use the new union types
- [x] All prompts use the new union types
- [x] All templates use the new union types
- [x] Scanner uses the new union types
- [x] All tests updated and passing
- [x] Invalid values caught at compile time

## Concrete Plan

1. **Update `src/types/index.ts`**:
   ```ts
   export type FrontendFramework = 'React + Vite' | 'Next.js' | 'Vue' | 'Angular' | 'None';
   export type Backend = 'Express' | 'NestJS' | 'FastAPI' | 'Firebase' | 'None';
   export type Database = 'PostgreSQL' | 'MongoDB' | 'Firestore' | 'SQLite' | 'None';
   export type AuthProvider = 'Firebase Auth' | 'NextAuth' | 'Auth0' | 'Custom' | 'None';
   export type StateManagement = 'Zustand' | 'Redux' | 'React Context' | 'Pinia' | 'None';
   export type TestingFramework = 'Vitest' | 'Jest' | 'Playwright' | 'Cypress' | 'None';
   export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
   export type AiAgent = 'cursor' | 'claude' | 'codex' | 'generic';
   
   export interface ProjectConfig {
     projectName: string;
     frontendFramework: FrontendFramework;
     backend: Backend;
     database: Database;
     authProvider: AuthProvider;
     stateManagement: StateManagement;
     testingFramework: TestingFramework;
     packageManager: PackageManager;
     aiAgent: AiAgent;
   }
   ```

2. **Update all 14 presets** — TypeScript will catch any mismatches. Most presets already use correct values; just add type annotations.

3. **Update `src/prompts/index.ts`** — change `select` choices to match union type values exactly:
   ```ts
   const choices: { name: string; value: FrontendFramework }[] = [
     { name: 'React + Vite', value: 'React + Vite' },
     ...
   ];
   ```

4. **Update `src/analyzers/scanner.ts`** — ensure `detectFromDependencies()` returns exact union values.

5. **Update `src/utils/validation.ts`** — `validatePreset` still works since it only checks for existence.

6. **Update all test files** that use `ProjectConfig` or partial configs:
   - `tests/template-engine.test.ts` — `standardConfig`, `minimalConfig`
   - `tests/preset.test.ts` — mock configs
   - `tests/file-generator.test.ts` — `mockConfig`
   - `tests/cli.test.ts` — mock config
   - `tests/scanner.test.ts` — expectations

7. **Run `npm run build`** to verify all types are satisfied.

## Files

- `src/types/index.ts`
- All `src/presets/*.ts` (14 files)
- `src/prompts/index.ts`
- `src/analyzers/scanner.ts`
- `src/utils/validation.ts`
- `tests/template-engine.test.ts`
- `tests/preset.test.ts`
- `tests/file-generator.test.ts`
- `tests/cli.test.ts`
- `tests/scanner.test.ts`
