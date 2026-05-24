import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger.js';

export interface ProjectConfigFile {
  preset?: string;
  output?: string;
  standard?: boolean;
  detect?: boolean;
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  interactive?: boolean;
  templates?: Record<string, string>;
  model?: string;
  apiEndpoint?: string;
}

const CONFIG_VARIANTS = [
  '.create-agent-docsrc',
  '.create-agent-docsrc.json',
  'create-agent-docs.json',
];

const VALID_FIELDS = new Set([
  'preset', 'output', 'standard', 'detect', 'force',
  'dryRun', 'yes', 'interactive', 'templates', 'model', 'apiEndpoint',
]);

export function validateConfig(config: Record<string, unknown>, filePath: string): boolean {
  const errors: string[] = [];

  for (const key of Object.keys(config)) {
    if (!VALID_FIELDS.has(key)) {
      errors.push(`Unknown field: "${key}"`);
    }
  }

  if (config.preset !== undefined && typeof config.preset !== 'string') {
    errors.push('"preset" must be a string');
  }
  if (config.output !== undefined && typeof config.output !== 'string') {
    errors.push('"output" must be a string');
  }
  if (config.templates !== undefined && (typeof config.templates !== 'object' || Array.isArray(config.templates))) {
    errors.push('"templates" must be an object (filename -> template path)');
  }
  if (config.model !== undefined && typeof config.model !== 'string') {
    errors.push('"model" must be a string');
  }
  if (config.apiEndpoint !== undefined && typeof config.apiEndpoint !== 'string') {
    errors.push('"apiEndpoint" must be a string');
  }
  for (const boolField of ['standard', 'detect', 'force', 'dryRun', 'yes', 'interactive']) {
    if (config[boolField] !== undefined && typeof config[boolField] !== 'boolean') {
      errors.push(`"${boolField}" must be a boolean`);
    }
  }

  if (errors.length > 0) {
    logger.warn(`Config validation warnings in ${path.basename(filePath)}:`);
    for (const err of errors) {
      logger.warn(`  ${err}`);
    }
    return false;
  }
  return true;
}

export function loadProjectConfig(dir: string = process.cwd()): ProjectConfigFile | null {
  for (const variant of CONFIG_VARIANTS) {
    const filePath = path.join(dir, variant);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readJsonSync(filePath) as Record<string, unknown>;
        validateConfig(raw, filePath);
        return raw as ProjectConfigFile;
      } catch {
        continue;
      }
    }
  }
  return null;
}

const ANSWERS_FILE = 'create-agent-docs.answers.json';

export interface SavedAnswers {
  projectName: string;
  frontendFramework: string;
  backend: string;
  database: string;
  authProvider: string;
  stateManagement: string;
  testingFramework: string;
  packageManager: string;
  aiAgent: string;
  generateStandardDocs?: boolean;
  license?: string;
  generateCicd?: boolean;
  cicdProvider?: string;
  generateDockerfile?: boolean;
  generateDockerCompose?: boolean;
}

export function saveAnswers(config: SavedAnswers, dir: string = process.cwd()): void {
  const filePath = path.join(dir, ANSWERS_FILE);
  try {
    fs.writeJsonSync(filePath, config, { spaces: 2 });
    logger.info(`Answers saved to ${ANSWERS_FILE}`);
  } catch (err) {
    logger.warn(`Failed to save answers: ${(err as Error).message}`);
  }
}

export function loadAnswers(dir: string = process.cwd()): SavedAnswers | null {
  const filePath = path.join(dir, ANSWERS_FILE);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readJsonSync(filePath);
      logger.info(`Loaded saved answers from ${ANSWERS_FILE}`);
      return raw as SavedAnswers;
    } catch {
      return null;
    }
  }
  return null;
}
