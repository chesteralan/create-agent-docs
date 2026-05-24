# F6 — Standard OSS document generation

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 2-3 hours

## Problem

The tool generates 8 AI-agent doc files but no standard project README, CONTRIBUTING, CHANGELOG, or LICENSE.

## Task

Add a `--standard` flag or new template category that generates standard OSS documents with stack-appropriate content.

## Acceptance Criteria

- [x] New `--standard` flag available
- [x] Generates `README.md` with stack-appropriate content
- [x] Generates `CHANGELOG.md`
- [x] Generates `CONTRIBUTING.md`
- [x] Generates `CODE_OF_CONDUCT.md`
- [x] Generates `SECURITY.md`
- [x] Generates `LICENSE` with license selection (MIT/Apache/GPL)
- [x] Templates use Handlebars and match project conventions
- [x] Tests pass

## Concrete Plan

1. **Create new templates** in `src/templates/`:
   - `README.md.hbs` — project overview, install, usage, stack badges (uses `{{> header}}` / `{{> footer}}`)
   - `CHANGELOG.md.hbs` — keep-a-changelog format with version placeholders
   - `CONTRIBUTING.md.hbs` — PR process, commit conventions, setup
   - `CODE_OF_CONDUCT.md.hbs` — standard Contributor Covenant
   - `SECURITY.md.hbs` — reporting vulnerabilities
   - `LICENSE.hbs` — selectable via `{{license}}` variable (MIT/Apache-2.0/GPL-3.0)

2. **Extend `ProjectConfig`** in `src/types/index.ts`:
   ```ts
   export type License = 'MIT' | 'Apache-2.0' | 'GPL-3.0';
   
   export interface ProjectConfig {
     // ... existing fields ...
     generateStandardDocs?: boolean;
     license?: License;
   }
   ```

3. **Add `--standard` flag** in `src/cli.ts` on the `generate` command.

4. **Add `STANDARD_TEMPLATES` array** in `src/generators/file-generator.ts`:
   ```ts
   const STANDARD_TEMPLATES: TemplateFile[] = [
     { name: 'README.md', template: 'README.md.hbs' },
     { name: 'CHANGELOG.md', template: 'CHANGELOG.md.hbs' },
     { name: 'CONTRIBUTING.md', template: 'CONTRIBUTING.md.hbs' },
     { name: 'CODE_OF_CONDUCT.md', template: 'CODE_OF_CONDUCT.md.hbs' },
     { name: 'SECURITY.md', template: 'SECURITY.md.hbs' },
     { name: 'LICENSE', template: 'LICENSE.hbs' },
   ];
   ```

5. **Add license selection prompt** in `src/prompts/index.ts`:
   ```ts
   const license = overrides.license ?? (await select({
     message: 'Select a license:',
     choices: [
       { name: 'MIT', value: 'MIT' },
       { name: 'Apache 2.0', value: 'Apache-2.0' },
       { name: 'GPL 3.0', value: 'GPL-3.0' },
     ],
   }));
   ```

6. **In `generateDocs()`**, conditionally include standard templates when `config.generateStandardDocs` is true (or when `--standard` flag is set).

## Files

- New templates: `src/templates/README.md.hbs`, `src/templates/CHANGELOG.md.hbs`, `src/templates/CONTRIBUTING.md.hbs`, `src/templates/CODE_OF_CONDUCT.md.hbs`, `src/templates/SECURITY.md.hbs`, `src/templates/LICENSE.hbs`
- `src/generators/file-generator.ts`
- `src/types/index.ts`
- `src/prompts/index.ts`
- `src/cli.ts`
