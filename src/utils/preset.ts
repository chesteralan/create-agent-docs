import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectConfig } from '../types/index.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadPreset(name: string): Promise<Partial<ProjectConfig> | undefined> {
  const ext = __filename.endsWith('.ts') ? '.ts' : '.js';
  const presetPath = path.resolve(__dirname, `../presets/${name}${ext}`);

  try {
    const module = await import(presetPath);
    const preset = module.default ?? module[`${name}Preset`];
    if (!preset) {
      logger.warn(`Preset "${name}" file exists but did not export a recognizable preset.`);
      return undefined;
    }
    logger.info(`Loaded preset "${name}"`);
    return preset as Partial<ProjectConfig>;
  } catch (err) {
    return undefined;
  }
}
