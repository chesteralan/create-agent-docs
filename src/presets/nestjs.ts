import type { ProjectConfig } from '../types/index.js';

export const nestjsPreset: Partial<ProjectConfig> = {
  projectName: 'my-nestjs-app',
  frontendFramework: 'None',
  backend: 'NestJS',
  database: 'PostgreSQL',
  authProvider: 'Custom',
  stateManagement: 'None',
  testingFramework: 'Jest',
  packageManager: 'yarn',
  aiAgent: 'generic',
};

export default nestjsPreset;
