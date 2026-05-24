#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { analyzeCommand } from './commands/analyze.js';
import { validateCommand } from './commands/validate.js';
import { upgradeCommand } from './commands/upgrade.js';
import { listPresetsCommand } from './commands/list-presets.js';
import { logger } from './utils/logger.js';
import { setVerbose, setDebug } from './utils/debug.js';
import { initNoColor } from './utils/no-color.js';
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
  .option('--no-color', 'disable colored output');

// Parse global flags before routing to commands
program.hook('preAction', (thisProgram) => {
  const opts = thisProgram.opts();
  if (opts.debug) setDebug(true);
  if (opts.verbose) setVerbose(true);
});

program
  .command('init')
  .description('Initialize AI-ready documentation templates in the target directory')
  .option('-d, --dry-run', 'output proposed files without writing to disk')
  .option('-f, --force', 'overwrite existing documentation files')
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
  .option('--no-spinner', 'disable spinners (useful for CI)')
  .option('--no-format', 'skip markdown formatting')
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

program
  .command('analyze')
  .description('Analyze existing documentation for completeness and consistency')
  .option('--strict', 'exit with non-zero code if any issues found')
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
