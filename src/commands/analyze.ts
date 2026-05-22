import { logger } from '../utils/logger.js';
import { promptProjectConfig } from '../prompts/index.js';
import { generateDocs, GenerateOptions } from '../generators/file-generator.js';

export interface AnalyzeOptionsCLI {
  dryRun?: boolean;
  force?: boolean;
}

export async function analyzeCommand(options: AnalyzeOptionsCLI) {
  logger.info('Running analyze command...');
  try {
    const config = await promptProjectConfig();
    const genOpts: GenerateOptions = {
      dryRun: options.dryRun,
      force: options.force,
    };
    // For now, reuse generateDocs to simulate analysis; real implementation would differ.
    await generateDocs(config, genOpts);
    logger.success('Analyze completed (placeholder).');
  } catch (err: any) {
    logger.error(`Analyze command failed: ${err.message || err}`);
    throw err;
  }
}
