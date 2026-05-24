# F10 — Snapshot tests for template output

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 1-2 hours

## Problem

No regression protection for template changes. The `examples/` dir has output but no automated comparison.

## Task

Add Vitest snapshot tests (`toMatchSnapshot()`) for each preset render. CI would catch unintended template changes.

## Acceptance Criteria

- [x] Snapshot tests exist for all presets
- [x] Tests render templates and match against stored snapshots
- [x] CI fails on unintended template changes
- [x] Snapshot updates documented in CONTRIBUTING guide
- [x] Tests pass on current output

## Concrete Plan

1. **Extend `tests/template-engine.test.ts`** with a new describe block:
   ```ts
   describe('Template snapshots', () => {
     const templateFiles = [
       'AGENTS.md.hbs',
       'ARCHITECTURE.md.hbs',
       'CODEBASE_MAP.md.hbs',
       'BUSINESS_RULES.md.hbs',
       'API_CONTRACTS.md.hbs',
       'UI_PATTERNS.md.hbs',
       'REFACTOR_RULES.md.hbs',
       'GLOSSARY.md.hbs',
     ];
     
     // Load all preset configs
     const presets = [
       { name: 'standard', config: standardConfig },
       { name: 'minimal', config: minimalConfig },
     ];
     
     for (const { name, config } of presets) {
       test(`all templates render match snapshot for ${name} config`, () => {
         const outputs: Record<string, string> = {};
         for (const file of templateFiles) {
           const content = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');
           outputs[file] = renderTemplate(content, {
             ...config,
             generatedDate: '2025-01-01',
             cliVersion: '1.0.0-test',
           } as any);
         }
         expect(outputs).toMatchSnapshot(name);
       });
     }
   });
   ```

2. **Run `vitest --update`** to generate initial snapshots in `tests/__snapshots__/template-engine.test.ts.snap`.

3. **Document snapshot updates** in `CONTRIBUTING.md`:
   ```
   ### Updating Snapshots
   After template changes, update snapshots with:
   ```
   vitest --update
   ```

4. **CI integration**: `vitest run` already fails on mismatched snapshots — no CI changes needed.

5. **Test `before`/`after` each snapshot**: use deterministic dates/versions in context to avoid flaky snapshots.

## Files

- `tests/template-engine.test.ts`
