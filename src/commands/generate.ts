import { generateDocs } from '../generators/file-generator.js';
import { promptProjectConfig } from '../prompts/index.js';
import { logger } from '../utils/logger.js';

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  output?: string;
}

export async function generateCommand(options: GenerateOptions) {
  logger.info('Running generate command...');
  const config = await promptProjectConfig();
  await generateDocs(config, {
    dryRun: options.dryRun,
    force: options.force,
    targetDir: options.output,
  });
}
