import { listPresets } from '../utils/preset.js';
import { logger } from '../utils/logger.js';

export async function listPresetsCommand(): Promise<void> {
  const presets = listPresets();
  logger.info('Available presets:\n');
  for (const preset of presets) {
    logger.info(`  ${preset.name.padEnd(12)} ${preset.description}`);
  }
  logger.info('\nUsage: create-agent-docs generate --preset <name>');
  logger.info('       create-agent-docs generate --preset ./path/to/custom.json');
}
