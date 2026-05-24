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

## Concrete Plan

1. **Create `src/plugins/types.ts`**:
   ```ts
   import type { ProjectConfig } from '../types/index.js';
   import type { FileResult } from '../generators/file-generator.js';
   
   export interface PluginHooks {
     beforeGenerate?: (config: ProjectConfig) => Promise<ProjectConfig>;
     afterGenerate?: (results: FileResult[]) => Promise<void>;
     beforeRender?: (template: string, context: Record<string, any>) => Promise<{ template: string; context: Record<string, any> }>;
     afterRender?: (content: string, file: string) => Promise<string>;
   }
   
   export interface CreateAgentDocsPlugin {
     name: string;
     version?: string;
     description?: string;
     hooks: PluginHooks;
     presets?: Record<string, Partial<ProjectConfig>>;
     templates?: Record<string, string>;
   }
   ```

2. **Create `src/plugins/loader.ts`**:
   ```ts
   import fs from 'fs-extra';
   import path from 'path';
   import type { CreateAgentDocsPlugin } from './types.js';
   
   const PLUGIN_PREFIX = 'create-agent-docs-plugin-';
   
   export async function loadPlugins(): Promise<CreateAgentDocsPlugin[]> {
     const plugins: CreateAgentDocsPlugin[] = [];
     
     // Scan local node_modules for plugins
     const nodeModules = path.resolve('node_modules');
     if (fs.existsSync(nodeModules)) {
       const dirs = fs.readdirSync(nodeModules);
       for (const dir of dirs) {
         if (dir.startsWith(PLUGIN_PREFIX)) {
           try {
             const plugin = await import(dir);
             if (plugin.default && plugin.default.hooks) {
               plugins.push(plugin.default);
             }
           } catch { /* skip invalid plugins */ }
         }
       }
     }
     
     return plugins;
   }
   ```

3. **Wire hooks into `file-generator.ts`**:
   ```ts
   const plugins = await loadPlugins();
   
   // beforeGenerate
   for (const plugin of plugins) {
     if (plugin.hooks.beforeGenerate) {
       config = await plugin.hooks.beforeGenerate(config);
     }
   }
   
   // In render loop:
   // beforeRender
   for (const plugin of plugins) {
     if (plugin.hooks.beforeRender) {
       ({ template: templateContent, context: renderContext } = await plugin.hooks.beforeRender(templateContent, renderContext));
     }
   }
   // afterRender
   for (const plugin of plugins) {
     if (plugin.hooks.afterRender) {
       rendered = await plugin.hooks.afterRender(rendered, file.name);
     }
   }
   
   // afterGenerate
   for (const plugin of plugins) {
     if (plugin.hooks.afterGenerate) {
       await plugin.hooks.afterGenerate(results);
     }
   }
   ```

4. **Add `plugins` subcommand** in `src/cli.ts`:
   ```ts
   program
     .command('plugins')
     .description('Manage plugins')
     .addCommand(pluginsSearchCommand)
     .addCommand(pluginsInstallCommand);
   ```

5. **Create plugin API docs** for plugin authors.

## Files

- `src/plugins/types.ts` (new)
- `src/plugins/loader.ts` (new)
- `src/generators/file-generator.ts`
- `src/cli.ts`
- `src/commands/plugins.ts` (new)
