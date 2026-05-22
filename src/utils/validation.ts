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
