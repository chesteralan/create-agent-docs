import type { ProjectConfig } from '../types/index.js';

export const expressPreset: Partial<ProjectConfig> = {
  projectName: 'my-express-app',
  frontendFramework: 'None',
  backend: 'Express',
  database: 'PostgreSQL',
  authProvider: 'Custom',
  stateManagement: 'None',
  testingFramework: 'Jest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default expressPreset;
