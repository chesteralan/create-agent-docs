import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import type { ProjectConfig } from '../types/index.js';
import { logger } from './logger.js';
import { debugLog } from './debug.js';
import { validatePreset } from './validation.js';

import { nextjsPreset } from '../presets/nextjs.js';
import { nextjsSaasPreset } from '../presets/nextjs-saas.js';
import { t3Preset } from '../presets/t3.js';
import { vuePreset } from '../presets/vue.js';
import { angularPreset } from '../presets/angular.js';
import { expressPreset } from '../presets/express.js';
import { nestjsPreset } from '../presets/nestjs.js';
import { mernPreset } from '../presets/mern.js';
import { reactFirebasePreset } from '../presets/react-firebase.js';
import { firebasePreset } from '../presets/firebase.js';
import { aiCursorPreset } from '../presets/ai-cursor.js';
import { aiClaudePreset } from '../presets/ai-claude.js';
import { aiCodexPreset } from '../presets/ai-codex.js';
import { fastapiPreset } from '../presets/fastapi.js';
import { chromeExtensionPreset } from '../presets/chrome-extension.js';

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
  { name: 'fastapi', description: 'FastAPI (Python) backend with PostgreSQL and JWT auth' },
  { name: 'chrome-extension', description: 'Chrome Extension (MV3) with React + Vite, Zustand, and Vitest' },
];

const BUILTIN_PRESETS: Record<string, Partial<ProjectConfig>> = {
  nextjs: nextjsPreset,
  'nextjs-saas': nextjsSaasPreset,
  t3: t3Preset,
  vue: vuePreset,
  angular: angularPreset,
  express: expressPreset,
  nestjs: nestjsPreset,
  mern: mernPreset,
  'react-firebase': reactFirebasePreset,
  firebase: firebasePreset,
  'ai-cursor': aiCursorPreset,
  'ai-claude': aiClaudePreset,
  'ai-codex': aiCodexPreset,
  fastapi: fastapiPreset,
  'chrome-extension': chromeExtensionPreset,
};

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

function loadBuiltinPreset(name: string): Partial<ProjectConfig> | undefined {
  const preset = BUILTIN_PRESETS[name];
  if (preset) {
    debugLog('Loaded preset config keys:', Object.keys(preset));
    logger.info(`Loaded preset "${name}"`);
    return preset;
  }
  logger.warn(`Preset "${name}" not found in built-in registry.`);
  return undefined;
}
