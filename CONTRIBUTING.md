# Contributing to create-agent-docs

Thanks for your interest in contributing! This guide covers development setup, coding standards, and how to add new presets or templates.

---

## Development Setup

```bash
git clone https://github.com/anomalyco/create-agent-docs.git
cd create-agent-docs
corepack enable
yarn install
yarn build
```

### Verify the Setup

```bash
node ./dist/cli.js --version
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `yarn build` | Compile TypeScript and copy templates |
| `yarn dev` | Watch mode — recompile on changes |
| `yarn test` | Run all tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:ci` | Run tests with verbose reporter |
| `yarn lint` | Check for lint errors |
| `yarn format` | Auto-format code with Prettier |

---

## Code Style

- **TypeScript** with strict mode
- **ESLint** via `@eslint/js` + `typescript-eslint`
- **Prettier** for formatting (run `yarn format` before committing)
- **ESM** only — all imports use `.js` extensions
- **Node.js >= 18** target

---

## Testing

We use [Vitest](https://vitest.dev/) for testing. Tests live in `tests/`.

```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
```

### Writing Tests

- Place tests in `tests/` with `.test.ts` extension
- Mock external modules with `vi.mock()`
- Use `beforeEach` to clear mocks
- Prefer testing behavior over implementation

---

## Pull Request Process

1. **Branch naming**: `feat/description`, `fix/description`, `chore/description`
2. **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add vue preset` — new feature
   - `fix: handle missing output directory` — bug fix
   - `docs: update README` — documentation
   - `chore: bump dependencies` — maintenance
3. **Before submitting**: Run `yarn lint && yarn test && yarn build`
4. **PR description**: Explain what changed and why. Link to related issues.

---

## Adding a New Preset

1. Create `src/presets/<name>.ts`:
   ```typescript
   import { ProjectConfig } from '../types/index.js';

   export const expressPreset: Partial<ProjectConfig> = {
     projectName: 'my-express-app',
     frontendFramework: 'None',
     backend: 'Express',
     database: 'PostgreSQL',
     authProvider: 'None',
     stateManagement: 'None',
     testingFramework: 'Jest',
     packageManager: 'npm',
   };

   export default expressPreset;
   ```

2. Register it in `src/utils/preset.ts`:
   ```typescript
   export const PRESET_REGISTRY: PresetInfo[] = [
     { name: 'express', description: 'Express with PostgreSQL and Jest' },
     // ... existing presets
   ];
   ```

3. Add tests in `tests/preset.test.ts`:
   ```typescript
   test('loads "express" preset with correct values', async () => {
     const preset = await loadPreset('express');
     expect(preset).toBeDefined();
     expect(preset?.backend).toBe('Express');
   });
   ```

4. Run `yarn test` to verify.

---

## Adding a New Template

1. Create `src/templates/<name>.md.hbs` with Handlebars syntax:
   ```handlebars
   # {{projectName}} — My New Doc

   {{#eq frontendFramework "Next.js"}}
   This project uses the App Router.
   {{/eq}}
   ```

2. Register it in `src/generators/file-generator.ts`:
   ```typescript
   const TEMPLATES: TemplateFile[] = [
     { name: 'MY_NEW_DOC.md', template: 'MY_NEW_DOC.md.hbs' },
     // ... existing templates
   ];
   ```

3. Available variables: `projectName`, `frontendFramework`, `backend`, `database`, `authProvider`, `stateManagement`, `testingFramework`, `packageManager`.

4. Available helpers: `{{#eq a "b"}}...{{/eq}}` for conditional content.

5. Run `yarn build && yarn generate --preset <name> --force` to verify output.
