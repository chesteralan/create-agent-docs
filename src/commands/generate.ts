import { generateDocs } from '../generators/file-generator.js';
import { promptProjectConfig } from '../prompts/index.js';
import { logger } from '../utils/logger.js';
import { loadPreset } from '../utils/preset.js';
import { validateOutputPath } from '../utils/validation.js';
import { scanProject, scanResultToConfig } from '../analyzers/scanner.js';
import { categorizeDependencies } from '../analyzers/architecture.js';
import { ProjectConfig } from '../types/index.js';

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  yes?: boolean;
  output?: string;
  preset?: string;
  detect?: boolean;
}

export async function generateCommand(options: GenerateOptions) {
  logger.info('Running generate command...');

  if (options.output) {
    const error = validateOutputPath(options.output);
    if (error) {
      logger.error(`Invalid output path: ${error}`);
      return;
    }
  }

  if (options.detect) {
    const scan = scanProject();
    const depMap = categorizeDependencies(scan.dependencies, scan.devDependencies);
    const detected = scanResultToConfig(scan);

    logger.info('Detected project settings:');
    logger.info(`  Project: ${logger.bold(detected.projectName!)}`);
    logger.info(`  Frontend: ${detected.frontendFramework}`);
    logger.info(`  Backend: ${detected.backend}`);
    logger.info(`  Database: ${detected.database}`);
    logger.info(`  Auth: ${detected.authProvider}`);
    logger.info(`  State: ${detected.stateManagement}`);
    logger.info(`  Testing: ${detected.testingFramework}`);
    logger.info(`  Package Manager: ${detected.packageManager}`);

    const frontendCount = depMap.frontend.length;
    const backendCount = depMap.backend.length;
    const testCount = depMap.testing.length;
    logger.info(`  Dependencies: ${scan.dependencyCount} runtime, ${scan.devDependencyCount} dev (${frontendCount} frontend, ${backendCount} backend, ${testCount} testing)`);

    if (scan.hasTsConfig) {
      logger.info(`  TypeScript: strict=${scan.tsStrict}, target=${scan.tsTarget || 'unknown'}`);
    }

    const defaultConfig = await promptProjectConfig(detected);
    await generateDocs(defaultConfig, {
      dryRun: options.dryRun,
      force: options.force,
      yes: options.yes,
      targetDir: options.output,
    });
    return;
  }

  let presetConfig: Partial<ProjectConfig> | undefined;
  if (options.preset) {
    presetConfig = await loadPreset(options.preset);
    if (presetConfig) {
      logger.info(`[preset] Using "${options.preset}" preset – skipping interactive prompts.`);
    } else {
      logger.warn(`Preset "${options.preset}" not found – falling back to interactive prompts.`);
    }
  }
  const config = await promptProjectConfig(presetConfig);
  await generateDocs(config, {
    dryRun: options.dryRun,
    force: options.force,
    yes: options.yes,
    targetDir: options.output,
  });
}
