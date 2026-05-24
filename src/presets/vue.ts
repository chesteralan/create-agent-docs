import type { ProjectConfig } from '../types/index.js';

export const vuePreset: Partial<ProjectConfig> = {
  projectName: 'my-vue-app',
  frontendFramework: 'Vue',
  backend: 'None',
  database: 'None',
  authProvider: 'None',
  stateManagement: 'Pinia',
  testingFramework: 'Jest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default vuePreset;
