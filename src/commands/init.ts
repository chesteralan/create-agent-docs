import { logger } from '../utils/logger.js';
import { promptProjectConfig } from '../prompts/index.js';
import { generateDocs, GenerateOptions } from '../generators/file-generator.js';
import { initGitRepo, createDefaultGitignore } from '../utils/git.js';
import { saveAnswers, loadAnswers } from '../utils/config-loader.js';
import type { ProjectConfig } from '../types/index.js';

export interface InitOptions {
  dryRun?: boolean;
  force?: boolean;
  git?: boolean;
}

export async function initCommand(options: InitOptions) {
  logger.info('Initializing agent documentation system...');

  const genOptions: GenerateOptions = {
    dryRun: options.dryRun,
    force: options.force,
    git: options.git,
  };

  const saved = loadAnswers();
  if (saved) {
    const config: ProjectConfig = {
      projectName: saved.projectName || 'my-app',
      frontendFramework: (saved.frontendFramework as ProjectConfig['frontendFramework']) || 'React + Vite',
      backend: (saved.backend as ProjectConfig['backend']) || 'None',
      database: (saved.database as ProjectConfig['database']) || 'None',
      authProvider: (saved.authProvider as ProjectConfig['authProvider']) || 'None',
      stateManagement: (saved.stateManagement as ProjectConfig['stateManagement']) || 'None',
      testingFramework: (saved.testingFramework as ProjectConfig['testingFramework']) || 'None',
      packageManager: (saved.packageManager as ProjectConfig['packageManager']) || 'npm',
      aiAgent: (saved.aiAgent as ProjectConfig['aiAgent']) || 'generic',
      generateStandardDocs: saved.generateStandardDocs,
      license: saved.license as ProjectConfig['license'],
      generateCicd: saved.generateCicd,
      cicdProvider: saved.cicdProvider as ProjectConfig['cicdProvider'],
      generateDockerfile: saved.generateDockerfile,
      generateDockerCompose: saved.generateDockerCompose,
    };
    logger.info(`Using saved answers from ${logger.bold('create-agent-docs.answers.json')}`);
    await generateDocs(config, genOptions);
    if (options.dryRun) {
      logger.success('Initialization dry-run completed. No files were written to disk.');
    } else {
      logger.success('Initialization successfully completed! Your documentation is ready under docs/.');
    }
    return;
  }

  try {
    const config = await promptProjectConfig();

    if (options.git && !options.dryRun) {
      const initialized = initGitRepo(process.cwd());
      if (initialized) {
        createDefaultGitignore(process.cwd());
        logger.success('Initialized git repository with .gitignore.');
      }
    }

    await generateDocs(config, genOptions);
    saveAnswers(config);

    if (options.dryRun) {
      logger.success('Initialization dry-run completed. No files were written to disk.');
    } else {
      logger.success(
        'Initialization successfully completed! Your documentation is ready under docs/.',
      );
    }
  } catch (err: any) {
    logger.error(`Initialization failed: ${err.message || err}`);
    throw err;
  }
}
