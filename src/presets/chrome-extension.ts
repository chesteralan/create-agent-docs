import type { ProjectConfig } from '../types/index.js';

export const chromeExtensionPreset: Partial<ProjectConfig> = {
  projectName: 'my-extension',
  frontendFramework: 'Chrome Extension',
  backend: 'None',
  database: 'None',
  authProvider: 'None',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default chromeExtensionPreset;
