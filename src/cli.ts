#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { analyzeCommand } from './commands/analyze.js';
import { validateCommand } from './commands/validate.js';
import { upgradeCommand } from './commands/upgrade.js';
import { restoreCommand } from './commands/restore.js';
import { listPresetsCommand } from './commands/list-presets.js';
import { pluginsListCommand, pluginsSearchCommand, pluginsInstallCommand } from './commands/plugins.js';
import { logger } from './utils/logger.js';
import { setVerbose, setDebug } from './utils/debug.js';
import { initNoColor } from './utils/no-color.js';
import { loadLocale } from './utils/locale.js';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let version = '0.1.0';
try {
  const pkg = fs.readJsonSync(join(__dirname, '../package.json'));
  version = pkg.version || version;
} catch { /* ignore */ }

const program = new Command();

program.addHelpText('beforeAll', `create-agent-docs v${version}\n`);

initNoColor();

const startTime = Date.now();

function printBanner(): void {
  console.log('');
  console.log(`╔══════════════════════════════════════╗`);
  console.log(`║     create-agent-docs v${version.padEnd(7)}       ║`);
  console.log(`║  AI-ready documentation scaffolding  ║`);
  console.log(`╚══════════════════════════════════════╝`);
  console.log('');
}

function exitHandler(code: number): void {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  if (code === 0) {
    logger.info(`Done in ${elapsed}s`);
  }
  process.exit(code);
}

printBanner();

program
  .name('create-agent-docs')
  .description(
    'CLI scaffolding tool to generate AI-ready documentation systems for software projects',
  )
  .version(version)
  .option('-v, --verbose', 'enable verbose output')
  .option('--debug', 'enable debug output (implies --verbose)')
  .option('--no-color', 'disable colored output')
  .option('--lang <code>', 'locale (default: en)');

// Parse global flags before routing to commands
program.hook('preAction', (thisProgram) => {
  const opts = thisProgram.opts();
  if (opts.debug) setDebug(true);
  if (opts.verbose) setVerbose(true);
  loadLocale(opts.lang || 'en');
});

program
  .command('init')
  .description('Initialize AI-ready documentation templates in the target directory')
  .option('-d, --dry-run', 'output proposed files without writing to disk')
  .option('-f, --force', 'overwrite existing documentation files')
  .option('--git', 'initialize git repository and create .gitignore')
  .option('--gemini-key <key>', 'Gemini API key for AI-generated docs')
  .action(async (options) => {
    try {
      await initCommand(options);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

program
  .command('generate')
  .description('Generate documentation files based on prompts')
  .option('-d, --dry-run', 'preview generated files without writing')
  .option('-f, --force', 'overwrite existing documentation files')
  .option('-y, --yes', 'auto-confirm all overwrite prompts (non-interactive)')
  .option('-o, --output <dir>', 'output directory (default: current working directory)')
  .option('-p, --preset <name>', 'use a predefined preset configuration to skip prompts')
  .option('-i, --interactive', 'run prompts interactively even with --preset')
  .option('--detect', 'auto-detect project settings from package.json and config files')
  .option('-w, --watch', 'watch templates and auto-re-generate on change')
  .option('--max-backups <number>', 'maximum backups to keep (default: 5)')
  .option('--standard', 'generate standard OSS docs (README, LICENSE, etc.)')
  .option('--cicd', 'generate CI/CD files (GitHub Actions, Dockerfile)')
  .option('--scaffold <dir>', 'scaffold basic project directory structure')
  .option('--git', 'initialize git repository and create .gitignore')
  .option('--no-spinner', 'disable spinners (useful for CI)')
  .option('--no-format', 'skip markdown formatting')
  .option('--gemini-key <key>', 'Gemini API key for AI-generated docs')
  .action(async (options) => {
    try {
      await generateCommand(options);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

program
  .command('presets')
  .description('List available stack presets')
  .action(async () => {
    try {
      await listPresetsCommand();
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

const pluginsCommand = program
  .command('plugins')
  .description('Manage plugins');

pluginsCommand
  .command('list')
  .description('List installed plugins')
  .action(async () => {
    try {
      await pluginsListCommand();
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

pluginsCommand
  .command('search [query]')
  .description('Search npm for plugins')
  .action(async (query) => {
    try {
      await pluginsSearchCommand(query);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

pluginsCommand
  .command('install <name>')
  .description('Install a plugin from npm')
  .action(async (name) => {
    try {
      await pluginsInstallCommand(name);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

program
  .command('analyze')
  .description('Analyze existing documentation for completeness and consistency')
  .option('--strict', 'exit with non-zero code if any issues found')
  .option('--ai', 'use AI (OpenAI) to suggest missing documentation sections')
  .option('--model <name>', 'AI model to use (default: gpt-4o-mini)')
  .option('--api-endpoint <url>', 'AI API endpoint (default: https://api.openai.com/v1/chat/completions)')
  .option('-d, --dry-run', 'show AI suggestions without prompting for generation')
  .action(async (options) => {
    try {
      await analyzeCommand(options);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

program
  .command('validate')
  .description('Validate generated documentation against schema')
  .option('--fix', 'auto-fix unsubstituted template variables')
  .action(async (options) => {
    try {
      await validateCommand(options);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

program
  .command('upgrade')
  .description('Upgrade CLI version and templates')
  .option('-d, --dry-run', 'preview upgrade steps without executing')
  .option('--diff', 'show template differences from latest published version')
  .option('--migrate', 'migrate generated docs to match current templates')
  .action(async (options) => {
    try {
      await upgradeCommand(options);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

program
  .command('restore [backup-id]')
  .description('Restore documentation from a backup')
  .option('--dry-run', 'show what would be restored without restoring')
  .option('-y, --yes', 'auto-confirm restore')
  .action(async (backupId, options) => {
    try {
      await restoreCommand(backupId, options);
      exitHandler(0);
    } catch (err) {
      const e = err as Error;
      logger.error(`Command failed: ${e.message || e}`);
      exitHandler(1);
    }
  });

// Handle unknown commands
program.on('command:*', () => {
  logger.error(`Invalid command: ${program.args.join(' ')}`);
  logger.info('Use --help to see a list of available commands.');
  exitHandler(1);
});

// Display help if run without arguments
if (process.argv.length <= 2) {
  program.outputHelp();
  exitHandler(0);
}

program.parse(process.argv);
