import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { ProjectConfig } from '../types/index.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PresetInfo {
  name: string;
  description: string;
}

export const PRESET_REGISTRY: PresetInfo[] = [
  { name: 'nextjs', description: 'Next.js with NextAuth, Redux, and Jest' },
  { name: 'vue', description: 'Vue with Pinia and Jest' },
  { name: 'angular', description: 'Angular with Jest' },
  { name: 'firebase', description: 'Firebase with Firestore, Firebase Auth, and Jest' },
];

export function listPresets(): PresetInfo[] {
  return PRESET_REGISTRY;
}

export async function loadPreset(name: string): Promise<Partial<ProjectConfig> | undefined> {
  if (name.endsWith('.json')) {
    return loadJsonPreset(name);
  }
  return loadBuiltinPreset(name);
}

async function loadJsonPreset(filePath: string): Promise<Partial<ProjectConfig> | undefined> {
  try {
    const resolved = path.resolve(filePath);
    const raw = await fs.readJson(resolved);
    logger.info(`Loaded custom preset from "${filePath}"`);
    return raw as Partial<ProjectConfig>;
  } catch (err) {
    logger.warn(`Failed to load custom preset "${filePath}": ${(err as Error).message}`);
    return undefined;
  }
}

async function loadBuiltinPreset(name: string): Promise<Partial<ProjectConfig> | undefined> {
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
  } catch {
    return undefined;
  }
}
