import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';
import { debugLog } from '../utils/debug.js';
import type { CreateAgentDocsPlugin } from './types.js';

const PLUGIN_PREFIX = 'create-agent-docs-plugin-';

export async function loadPlugins(): Promise<CreateAgentDocsPlugin[]> {
  const plugins: CreateAgentDocsPlugin[] = [];
  const searchDirs = [
    path.resolve('node_modules'),
    ...(require.main?.paths || []),
  ];

  const seen = new Set<string>();

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith(PLUGIN_PREFIX) && !seen.has(entry)) {
          seen.add(entry);
          try {
            const pluginModule = await import(entry);
            const plugin = pluginModule.default || pluginModule;
            if (plugin && plugin.name && plugin.hooks) {
              plugins.push(plugin as CreateAgentDocsPlugin);
              debugLog('Loaded plugin', plugin.name);
            }
          } catch (err: any) {
            debugLog('Failed to load plugin', entry, err.message);
          }
        }
      }
    } catch {
      // skip inaccessible directories
    }
  }

  if (plugins.length > 0) {
    logger.info(`Loaded ${plugins.length} plugin(s): ${plugins.map(p => p.name).join(', ')}`);
  }

  return plugins;
}

export async function loadPluginPresets(): Promise<Record<string, Partial<import('../types/index.js').ProjectConfig>>> {
  const plugins = await loadPlugins();
  const presets: Record<string, Partial<import('../types/index.js').ProjectConfig>> = {};
  for (const plugin of plugins) {
    if (plugin.presets) {
      Object.assign(presets, plugin.presets);
    }
  }
  return presets;
}
