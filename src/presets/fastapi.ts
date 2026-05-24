import type { ProjectConfig } from '../types/index.js';

export const fastapiPreset: Partial<ProjectConfig> = {
  projectName: 'my-fastapi-app',
  frontendFramework: 'None',
  backend: 'FastAPI',
  database: 'PostgreSQL',
  authProvider: 'Custom',
  stateManagement: 'None',
  testingFramework: 'None',
  packageManager: 'yarn',
  aiAgent: 'generic',
};

export default fastapiPreset;
