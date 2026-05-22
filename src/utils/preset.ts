import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { ProjectConfig } from '../types/index.js';
import { logger } from './logger.js';
import { debugLog } from './debug.js';
import { validatePreset } from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PresetInfo {
  name: string;
  description: string;
}

export const PRESET_REGISTRY: PresetInfo[] = [
  { name: 'nextjs', description: 'Next.js with NextAuth, Redux, and Jest' },
  { name: 'nextjs-saas', description: 'Next.js SaaS with NextAuth, PostgreSQL, Zustand, and Vitest' },
  { name: 't3', description: 'T3 Stack: Next.js, tRPC, Prisma, Tailwind, NextAuth, and Vitest' },
  { name: 'vue', description: 'Vue with Pinia and Jest' },
  { name: 'angular', description: 'Angular with Jest' },
  { name: 'express', description: 'Express backend with PostgreSQL and JWT auth' },
  { name: 'nestjs', description: 'NestJS backend with PostgreSQL and JWT auth' },
  { name: 'mern', description: 'MERN: MongoDB, Express, React + Vite, Node.js, and Redux' },
  { name: 'react-firebase', description: 'React + Vite with Firebase, Firestore, Firebase Auth, and Vitest' },
  { name: 'firebase', description: 'Firebase with Firestore, Firebase Auth, and Jest' },
  { name: 'ai-cursor', description: 'React + Vite with Cursor-optimized config' },
  { name: 'ai-claude', description: 'React + Vite with Claude-optimized config' },
  { name: 'ai-codex', description: 'React + Vite with Codex-optimized config' },
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
    const missing = validatePreset(raw);
    if (missing.length > 0) {
      logger.warn(`Custom preset "${filePath}" is missing keys: ${missing.join(', ')}`);
    }
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

  debugLog('loadBuiltinPreset', { name, presetPath, ext });

  try {
    const module = await import(presetPath);
    const preset = module.default ?? module[`${name}Preset`];
    if (!preset) {
      logger.warn(`Preset "${name}" file exists but did not export a recognizable preset.`);
      return undefined;
    }
    debugLog('Loaded preset config keys:', Object.keys(preset as object));
    logger.info(`Loaded preset "${name}"`);
    return preset as Partial<ProjectConfig>;
  } catch {
    return undefined;
  }
}
