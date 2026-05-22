# Changelog

All notable changes to create-agent-docs will be documented in this file.

## [0.3.1] - 2026-05-23

### Added
- Stack presets: nextjs, vue, angular, firebase
- `--preset` flag for generate command
- `presets` subcommand to list available presets
- Custom JSON preset support (`--preset ./custom.json`)
- `listPresets` function with name/description registry
- Vitest testing infrastructure (13 tests)
- CI/CD workflows (lint, test, build, release)
- npm metadata (keywords, repository, engines, publishConfig)
- Comprehensive README with command reference and examples
- CONTRIBUTING.md, CHANGELOG.md, CODE_OF_CONDUCT.md, SECURITY.md
- Example output directories (nextjs-output, firebase-output)

### Fixed
- `generateCommand` now actually calls `loadPreset` instead of ignoring it
- Preset file extension detection works in both dev (`.ts`) and prod (`.js`)
- Logger mock now exports `logger` object (not top-level methods)

### Changed
- Bumped version from `0.1.0` to `0.3.1`
- `loadPreset` returns `undefined` instead of throwing on unknown presets
- Removed duplicate `preset-utils.ts`
- Switched from Jest to Vitest for testing

## [0.1.0] - 2026-05-23

### Added
- Initial CLI with `init`, `generate`, `analyze`, `validate`, `upgrade` commands
- Interactive prompts for project configuration (name, frontend, backend, database, auth, state management, testing, package manager)
- Handlebars template engine with 8 documentation templates
- File generation with dry-run, force overwrite, and backup support
- Project name validation
- Chalk-based logger with info/success/warn/error levels
- MIT License
