import { execSync } from 'child_process';
import { logger } from '../utils/logger.js';
import { loadPlugins } from '../plugins/loader.js';

export async function pluginsListCommand(): Promise<void> {
  const plugins = await loadPlugins();

  if (plugins.length === 0) {
    logger.info('No plugins found.');
    logger.info('Search npm for plugins: npm search create-agent-docs-plugin');
    return;
  }

  logger.header('Installed Plugins');
  for (const plugin of plugins) {
    const version = plugin.version ? ` v${plugin.version}` : '';
    const description = plugin.description ? ` — ${plugin.description}` : '';
    logger.info(`  ${logger.bold(plugin.name)}${version}${description}`);
  }
}

export async function pluginsSearchCommand(query?: string): Promise<void> {
  const searchTerm = query || 'create-agent-docs-plugin';
  logger.info(`Searching npm for "${searchTerm}"...`);
  try {
    const output = execSync(`npm search "${searchTerm}" --json 2>/dev/null`, {
      encoding: 'utf8',
      timeout: 15000,
    });
    const results = JSON.parse(output);
    if (results.length === 0) {
      logger.info('No results found.');
      return;
    }
    logger.header('Search Results');
    for (const pkg of results.slice(0, 20)) {
      logger.info(`  ${logger.bold(pkg.name)} v${pkg.version} — ${pkg.description || 'No description'}`);
    }
  } catch {
    logger.warn('Could not search npm. Are you offline?');
  }
}

export async function pluginsInstallCommand(name: string): Promise<void> {
  const fullName = name.startsWith('create-agent-docs-plugin-') ? name : `create-agent-docs-plugin-${name}`;
  logger.info(`Installing ${logger.bold(fullName)}...`);
  try {
    execSync(`npm install ${fullName}`, { stdio: 'inherit', timeout: 60000 });
    logger.success(`Installed ${fullName}`);
  } catch (err: any) {
    logger.error(`Failed to install ${fullName}: ${err.message}`);
  }
}
