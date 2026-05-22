import { logger } from '../utils/logger.js';
import { promptProjectConfig } from '../prompts/index.js';
import { generateDocs, GenerateOptions } from '../generators/file-generator.js';

export interface InitOptions {
  dryRun?: boolean;
  force?: boolean;
}

export async function initCommand(options: InitOptions) {
  logger.info('Initializing agent documentation system...');

  try {
    // 1. Gather configuration via interactive prompts
    const config = await promptProjectConfig();

    // 2. Map command-line choices to generator options
    const genOptions: GenerateOptions = {
      dryRun: options.dryRun,
      force: options.force,
    };

    // 3. Generate documentation files from presets
    await generateDocs(config, genOptions);

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
