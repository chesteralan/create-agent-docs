import { ProjectConfig } from '../types/index.js';

const REQUIRED_CONFIG_KEYS: (keyof ProjectConfig)[] = [
  'projectName',
  'frontendFramework',
  'backend',
  'database',
  'authProvider',
  'stateManagement',
  'testingFramework',
  'packageManager',
  'aiAgent',
];

export function validatePreset(preset: Partial<ProjectConfig>): string[] {
  const missing: string[] = [];
  for (const key of REQUIRED_CONFIG_KEYS) {
    if (preset[key] === undefined || preset[key] === null) {
      missing.push(key);
    }
  }
  return missing;
}

const PATH_TRAVERSAL_RE = /\.\.(\/|\\)|%2e%2e/i;
const NULL_BYTE_RE = /\0/;
const SHELL_META_RE = /[;|`$(){}[\]!]/;

export function sanitizePath(input: string): string | null {
  if (PATH_TRAVERSAL_RE.test(input)) return null;
  if (NULL_BYTE_RE.test(input)) return null;
  if (SHELL_META_RE.test(input)) return null;
  return input;
}

export function validateOutputPath(resolvedPath: string): string | null {
  if (!resolvedPath || resolvedPath.length === 0) {
    return 'Output path cannot be empty.';
  }
  if (PATH_TRAVERSAL_RE.test(resolvedPath)) {
    return 'Output path contains path traversal sequences.';
  }
  if (NULL_BYTE_RE.test(resolvedPath)) {
    return 'Output path contains null bytes.';
  }
  if (SHELL_META_RE.test(resolvedPath)) {
    return 'Output path contains shell metacharacters.';
  }
  return null;
}

export const validators = {
  projectName: (input: string): boolean | string => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return 'Project name cannot be empty.';
    }
    const validPattern = /^[a-zA-Z0-9\-_]+$/;
    if (!validPattern.test(trimmed)) {
      return 'Project name can only contain alphanumeric characters, dashes, and underscores.';
    }
    return true;
  },
};
