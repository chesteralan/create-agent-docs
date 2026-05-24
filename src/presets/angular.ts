import type { ProjectConfig } from '../types/index.js';

export const angularPreset: Partial<ProjectConfig> = {
  projectName: 'my-angular-app',
  frontendFramework: 'Angular',
  backend: 'None',
  database: 'None',
  authProvider: 'None',
  stateManagement: 'None',
  testingFramework: 'Jest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default angularPreset;
