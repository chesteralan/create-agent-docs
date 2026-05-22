import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface UpgradeOptions {
  dryRun?: boolean;
}

async function getCurrentVersion(): Promise<string> {
  try {
    const pkg = await fs.readJson(path.resolve(__dirname, '../../package.json'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function getLatestVersion(): Promise<string | null> {
  try {
    const output = execSync('npm view create-agent-docs version 2>/dev/null', {
      encoding: 'utf8',
      timeout: 10000,
    });
    return output.trim();
  } catch {
    return null;
  }
}

export async function upgradeCommand(options: UpgradeOptions = {}): Promise<void> {
  logger.info('Checking for updates...');

  const current = await getCurrentVersion();
  logger.info(`Current version: ${logger.bold(current)}`);

  const latest = await getLatestVersion();

  if (!latest) {
    logger.warn('Could not check npm registry. Are you offline?');
    logger.info('Running yarn install to refresh local dependencies...');
    if (!options.dryRun) {
      execSync('yarn install', { stdio: 'inherit' });
    } else {
      logger.info('[Dry-Run] Would run: yarn install');
    }
    logger.success('Dependencies refreshed.');
    return;
  }

  logger.info(`Latest version:  ${logger.bold(latest)}`);

  if (current === latest) {
    logger.success('You are on the latest version.');
    return;
  }

  logger.info(`A newer version (${latest}) is available!`);
  logger.info(`Run: ${logger.bold('npm install -g create-agent-docs@latest')}`);
  logger.info(`Or:  ${logger.bold('npx create-agent-docs@latest')}`);

  if (!options.dryRun) {
    logger.info('Upgrading local installation...');
    try {
      execSync('yarn install', { stdio: 'inherit' });
      logger.success('Dependencies refreshed.');
    } catch (err: any) {
      logger.error(`Failed to refresh dependencies: ${err.message}`);
      throw err;
    }
  }
}
