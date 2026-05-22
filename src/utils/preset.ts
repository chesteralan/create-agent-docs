import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { ProjectConfig } from '../types/index.js';
import { logger } from './logger.js';

/**
 * Load a preset configuration by name.
 * Returns a Partial<ProjectConfig> if the preset exists.
 * Throws an Error with a friendly message when the preset cannot be found.
 */
export async function loadPreset(name: string): Promise<Partial<ProjectConfig>> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const presetPath = path.resolve(__dirname, `../presets/${name}.ts`);

  // Verify the preset file actually exists before attempting import
  if (!(await fs.pathExists(presetPath))) {
    logger.warn(`Preset "${name}" not found. Available presets: nextjs, vue, angular, firebase.`);
    throw new Error(`Unknown preset: ${name}`);
  }

  try {
    const module = await import(presetPath);
    const preset = module.default ?? module[`${name}Preset`];
    if (!preset) {
      logger.warn(`Preset "${name}" file exists but did not export a recognizable preset.`);
      throw new Error(`Invalid preset export: ${name}`);
    }
    logger.info(`Loaded preset "${name}"`);
    return preset as Partial<ProjectConfig>;
  } catch (err) {
    logger.error(`Failed to load preset "${name}": ${(err as Error).message}`);
    throw err;
  }
}
