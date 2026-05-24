# F11 — CI/CD template generation

**Tier:** 3 — High Impact, High Effort  
**Effort:** 3-4 hours

## Problem

Scanner detects CI/CD files but templates never generate them. `scanProject()` already checks for Dockerfile, docker-compose.yml, ESLint, Prettier, etc.

## Task

Add template set for GitHub Actions workflows, Dockerfile, docker-compose.yml, and platform-specific configs based on detected or prompted choices.

## Acceptance Criteria

- [x] Generates GitHub Actions CI workflow based on detected stack
- [x] Generates `Dockerfile` with appropriate base image
- [x] Generates `docker-compose.yml` if applicable
- [x] Platform-specific configs generated when detected
- [x] User prompted for CI/CD provider selection if ambiguous
- [x] All templates follow existing Handlebars conventions

## Concrete Plan

1. **Create templates** in `src/templates/`:
   - `workflows/ci.yml.hbs` — GitHub Actions CI workflow (uses `{{nodeVersion}}`, `{{packageManager}}`, `{{testingFramework}}`)
   - `Dockerfile.hbs` — multi-stage Dockerfile with appropriate base (node/python based on stack)
   - `docker-compose.yml.hbs` — compose file with app + db services

2. **Extend `ProjectConfig`** in `src/types/index.ts`:
   ```ts
   generateCicd?: boolean;
   cicdProvider?: 'github-actions' | 'none';
   generateDockerfile?: boolean;
   generateDockerCompose?: boolean;
   ```

3. **Add CI/CD templates array** in `file-generator.ts`:
   ```ts
   const CICD_TEMPLATES: TemplateFile[] = [
     { name: '.github/workflows/ci.yml', template: 'workflows/ci.yml.hbs' },
     { name: 'Dockerfile', template: 'Dockerfile.hbs' },
     { name: 'docker-compose.yml', template: 'docker-compose.yml.hbs' },
   ];
   ```

4. **Add CI/CD prompts** in `src/prompts/index.ts`:
   ```ts
   const cicdProvider = await select({
     message: 'Select CI/CD provider:',
     choices: [
       { name: 'GitHub Actions', value: 'github-actions' },
       { name: 'None', value: 'none' },
     ],
   });
   
   const dockerfile = await confirm({
     message: 'Generate Dockerfile?',
     default: true,
   });
   ```

5. **Conditionally include** in `generateDocs()` when `config.generateCicd` is true or `--cicd` flag is set.

6. **Leverage scanner**: use existing `scanProject()` results for `hasDockerfile`, `hasDockerCompose` to pre-fill prompts.

## Files

- New templates: `src/templates/workflows/ci.yml.hbs`, `src/templates/Dockerfile.hbs`, `src/templates/docker-compose.yml.hbs`
- `src/prompts/index.ts`
- `src/generators/file-generator.ts`
- `src/types/index.ts`
