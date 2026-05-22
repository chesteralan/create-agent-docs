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
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get package version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let version = '0.1.0';
try {
  const pkg = fs.readJsonSync(join(__dirname, '../package.json'));
  version = pkg.version || version;
} catch { /* ignore */ }

const program = new Command();

program
  .name('create-agent-docs')
  .description(
    'CLI scaffolding tool to generate AI-ready documentation systems for software projects',
  )
  .version(version)
  .option('-v, --verbose', 'enable verbose output')
  .option('--debug', 'enable debug output (implies --verbose)');

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
    } catch (err) {
      logger.error(`Command failed: ${err.message || err}`);
      process.exit(1);
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
  .action(async (options) => {
    try {
      await generateCommand(options);
    } catch (err) {
      logger.error(`Command failed: ${err.message || err}`);
      process.exit(1);
    }
  });

program
  .command('presets')
  .description('List available stack presets')
  .action(async () => {
    try {
      await listPresetsCommand();
    } catch (err) {
      logger.error(`Command failed: ${err.message || err}`);
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyze existing documentation for completeness and consistency')
  .option('--strict', 'exit with non-zero code if any issues found')
  .action(async (options) => {
    try {
      await analyzeCommand(options);
    } catch (err) {
      logger.error(`Command failed: ${err.message || err}`);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate generated documentation against schema')
  .option('--fix', 'auto-fix unsubstituted template variables')
  .action(async (options) => {
    try {
      await validateCommand(options);
    } catch (err) {
      logger.error(`Command failed: ${err.message || err}`);
      process.exit(1);
    }
  });

program
  .command('upgrade')
  .description('Upgrade CLI version and templates')
  .option('-d, --dry-run', 'preview upgrade steps without executing')
  .action(async (options) => {
    try {
      await upgradeCommand(options);
    } catch (err) {
      logger.error(`Command failed: ${err.message || err}`);
      process.exit(1);
    }
  });

// Handle unknown commands
program.on('command:*', () => {
  logger.error(`Invalid command: ${program.args.join(' ')}`);
  logger.info('Use --help to see a list of available commands.');
  process.exit(1);
});

// Display help if run without arguments
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse(process.argv);
