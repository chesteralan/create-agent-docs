import { generateDocs } from '../generators/file-generator.js';
import { promptProjectConfig } from '../prompts/index.js';
import { logger } from '../utils/logger.js';
import { loadPreset } from '../utils/preset.js';
import { ProjectConfig } from '../types/index.js';

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  output?: string;
  preset?: string;
}

export async function generateCommand(options: GenerateOptions) {
  logger.info('Running generate command...');
  let presetConfig: Partial<ProjectConfig> | undefined;
  if (options.preset) {
    logger.info(`[preset] Using "${options.preset}" preset – skipping interactive prompts.`);
  }
  const config = await promptProjectConfig(presetConfig);
  await generateDocs(config, {
    dryRun: options.dryRun,
    force: options.force,
    targetDir: options.output,
  });
}
