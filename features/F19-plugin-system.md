# F19 — Plugin system

**Tier:** 4 — Medium Impact, High Effort  
**Effort:** 8-12 hours

## Problem

No way for third-party packages to extend the tool (custom presets, custom templates, custom prompts, custom analyzers).

## Task

Design a plugin interface. Plugins are npm packages named `create-agent-docs-plugin-*`. Plugin hooks: `beforeGenerate`, `afterGenerate`, `beforeRender`, `afterRender`. Plugin API: access to config, templates, and generated files. Plugin registry subcommand: `plugins search`, `plugins install`.

## Acceptance Criteria

- [ ] Plugin interface defined with TypeScript types
- [ ] Plugin loader discovers `create-agent-docs-plugin-*` packages
- [ ] Hooks fire at correct lifecycle points
- [ ] Plugin API provides access to config, templates, generated files
- [ ] `plugins search` subcommand lists available plugins
- [ ] `plugins install` subcommand installs a plugin
- [ ] Plugins can provide custom presets, templates, prompts, analyzers
- [ ] Comprehensive tests for plugin lifecycle
- [ ] Documentation for plugin authors

## Files

- `src/plugins/` (new directory)
- Plugin loader
- Plugin API types
