import { generateDocs } from '../generators/file-generator.js';
import { promptProjectConfig } from '../prompts/index.js';
import { logger } from '../utils/logger.js';
import { t } from '../utils/locale.js';
import { loadPreset } from '../utils/preset.js';
import { loadProjectConfig } from '../utils/config-loader.js';
import { clearTemplateCache } from '../generators/template-engine.js';
import { createWatcher } from '../utils/watcher.js';
import { validateOutputPath } from '../utils/validation.js';
import { scanProject, scanResultToConfig } from '../analyzers/scanner.js';
import { categorizeDependencies } from '../analyzers/architecture.js';
import { ProjectConfig } from '../types/index.js';
import { detectMonorepo, getPerPackageConfig } from '../utils/monorepo.js';
import { checkbox } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE_DIR = join(__dirname, '../templates');

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  yes?: boolean;
  output?: string;
  preset?: string;
  detect?: boolean;
  noSpinner?: boolean;
  interactive?: boolean;
  watch?: boolean;
  maxBackups?: number;
  standard?: boolean;
  cicd?: boolean;
  scaffold?: string;
  git?: boolean;
}

export async function generateCommand(options: GenerateOptions) {
  logger.info(t('cli.runningGenerate'));

  const fileConfig = loadProjectConfig();
  if (fileConfig) {
    logger.info(`Loaded config from ${logger.bold('.create-agent-docsrc')}`);
    options.preset = options.preset || fileConfig.preset;
    options.output = options.output || fileConfig.output;
    options.detect = options.detect || fileConfig.detect;
    options.interactive = options.interactive || fileConfig.interactive;
  }

  if (options.output) {
    const error = validateOutputPath(options.output);
    if (error) {
      logger.error(`Invalid output path: ${error}`);
      return;
    }
  }

  const genOpts = {
    dryRun: options.dryRun,
    force: options.force,
    yes: options.yes,
    targetDir: options.output,
    noSpinner: options.noSpinner,
    maxBackups: options.maxBackups,
    scaffold: options.scaffold,
    git: options.git,
  };

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
    logger.info(`  Dependencies: ${Object.keys(scan.dependencies).length} runtime, ${Object.keys(scan.devDependencies).length} dev (${frontendCount} frontend, ${backendCount} backend, ${testCount} testing)`);

    if (scan.hasTsConfig) {
      logger.info(`  TypeScript: strict=${scan.tsStrict}, target=${scan.tsTarget || 'unknown'}`);
    }

    if (options.interactive) {
      const detectConfig = await promptProjectConfig(detected);
      detectConfig.generateStandardDocs = options.standard ?? detectConfig.generateStandardDocs;
      detectConfig.generateCicd = options.cicd ?? detectConfig.generateCicd;
      await generateDocs(detectConfig, genOpts);
    } else {
      const defaults: ProjectConfig = {
        projectName: 'my-app',
        frontendFramework: 'React + Vite',
        backend: 'None',
        database: 'None',
        authProvider: 'None',
        stateManagement: 'None',
        testingFramework: 'None',
        packageManager: 'npm',
        aiAgent: 'generic',
      };
      const config: ProjectConfig = { ...defaults, ...detected };
      config.generateStandardDocs = options.standard ?? config.generateStandardDocs;
      config.generateCicd = options.cicd ?? config.generateCicd;
      await generateDocs(config, genOpts);
    }
    return;
  }

  let presetConfig: Partial<ProjectConfig> | undefined;
  if (options.preset) {
    presetConfig = await loadPreset(options.preset);
    if (presetConfig) {
      if (options.interactive) {
        logger.info(`[preset] Using "${options.preset}" as defaults – interactive mode.`);
      } else {
        logger.info(`[preset] Using "${options.preset}" preset – skipping interactive prompts.`);
      }
    } else {
      logger.warn(`Preset "${options.preset}" not found – falling back to interactive prompts.`);
    }
  }

  if (options.preset && presetConfig && !options.interactive) {
    // Non-interactive: merge preset into defaults and skip prompts
    const defaultConfig = {
      projectName: 'my-app',
      frontendFramework: 'React + Vite',
      backend: 'None',
      database: 'None',
      authProvider: 'None',
      stateManagement: 'None',
      testingFramework: 'None',
      packageManager: 'npm',
      aiAgent: 'generic' as const,
    };
    const config = { ...defaultConfig, ...presetConfig } as ProjectConfig;
    config.generateStandardDocs = options.standard ?? config.generateStandardDocs;
    config.generateCicd = options.cicd ?? config.generateCicd;
    await generateDocs(config, genOpts);
    return;
  }

  const config = await promptProjectConfig(presetConfig);
  config.generateStandardDocs = options.standard ?? config.generateStandardDocs;
  config.generateCicd = options.cicd ?? config.generateCicd;
  await generateDocs(config, genOpts);

  const monorepoPackages = detectMonorepo();
  if (monorepoPackages && process.stdout.isTTY) {
    const choices = monorepoPackages.map(p => ({
      name: `${p.name} (${relative(process.cwd(), p.dir)})`,
      value: p,
    }));
    const selected = await checkbox({
      message: 'Monorepo detected! Select packages to generate docs for:',
      choices,
    });
    for (const pkg of selected) {
      const perPkgConfig = getPerPackageConfig(pkg);
      const pkgConfig = { ...config, projectName: pkg.name, ...perPkgConfig } as ProjectConfig;
      logger.info(`Generating docs for ${logger.bold(pkg.name)}...`);
      await generateDocs(pkgConfig, { ...genOpts, targetDir: pkg.dir });
    }
  }

  if (options.watch) {
    logger.info('Watching templates for changes...');
    const watcher = createWatcher(TEMPLATE_DIR, async (event, file) => {
      logger.info(`Change detected: ${file} (${event}) — re-generating...`);
      clearTemplateCache();
      await generateDocs(config, { ...genOpts, dryRun: false, force: true });
      logger.info('Watching for more changes...');
    });
    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
    await new Promise(() => {});
  }
}
