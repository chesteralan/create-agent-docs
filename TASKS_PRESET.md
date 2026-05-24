# TASKS_PRESET.md

## Overview
Add full support for stack presets in the CLI.

## Tasks

- [x] **Wire Preset Loader into CLI**
  - Ensure `src/utils/preset-utils.ts` (or `src/utils/preset.ts`) is imported in `src/commands/generate.ts`.
  - Add a log message when a preset is not found, e.g., `logger.warn('Preset "${name}" not found – falling back to interactive prompts.')`.

- [x] **Validate Preset Name**
  - In `loadPreset`, verify the requested name matches a file in `src/presets/`.
  - If missing, return `undefined` and let the caller handle the warning.

- [x] **Update Generate Command Options**
  - Confirm `src/cli.ts` already defines `-p, --preset <name>`.
  - In `src/commands/generate.ts`, merge `presetConfig` with interactive overrides from `promptProjectConfig(presetConfig)`.
  - Ensure any explicit CLI flags (`--force`, `--dry-run`, `--output`) still apply.

- [x] **Prompt Function Signature**
  - Verify `promptProjectConfig(overrides?: Partial<ProjectConfig>)` is used by all callers.
  - Update any other command (e.g., `init`) if they call the prompt without overrides.

- [x] **Documentation & Usage Guide**
  - Edit `README.md` to add a **Presets** section with examples:
    ```bash
    npx create-agent-docs generate --preset nextjs
    ```
  - List all preset names (`nextjs`, `vue`, `angular`, `firebase`) with a brief description.

- [x] **Add Unit Tests**
  - In `tests/preset.test.ts`:
    - Test loading each preset returns a complete `Partial<ProjectConfig>` (all keys defined).
    - Mock `generateDocs` and run `generateCommand({ preset: 'nextjs' })`; assert the config passed matches the preset values.
    - Test unknown preset results in a warning and falls back to interactive prompts.

- [x] **Run Verification Suite**
  - Execute `yarn test` (or `npm test`).
  - Ensure existing tests still pass.
  - Manually run a few preset commands to verify generated docs contain framework‑specific sections.

- [x] **Polish CLI UX**
  - When a preset is used, display a banner:
    `[preset] Using "Next.js" preset – skipping interactive prompts.`
  - Confirm additional flags (`--force`, `--dry-run`) are still honored.

- [x] **Commit & Tag**
  - Bump version to `0.3.1` in `package.json`.
  - Commit changes and create Git tag `v0.3.1-presets` (do not push automatically).

- [x] **Future Enhancements (optional)**
  - Add `--list-presets` command to enumerate presets.
  - Allow custom preset JSON files via `--preset path/to/custom.json`.

---

**Verification Plan**
- Run unit tests for preset loading and generate command.
- Manually test CLI output for preset usage.
- Ensure documentation updates are rendered correctly.
