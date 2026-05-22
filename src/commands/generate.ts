import { generateDocs } from '../generators/file-generator.js';
import { promptProjectConfig } from '../prompts/index.js';
import { logger } from '../utils/logger.js';
import { loadPreset } from '../utils/preset.js';
import { validateOutputPath } from '../utils/validation.js';
import { ProjectConfig } from '../types/index.js';

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  yes?: boolean;
  output?: string;
  preset?: string;
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
