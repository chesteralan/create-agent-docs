import type { ProjectConfig } from '../types/index.js';

export const mernPreset: Partial<ProjectConfig> = {
  projectName: 'my-mern-app',
  frontendFramework: 'React + Vite',
  backend: 'Express',
  database: 'MongoDB',
  authProvider: 'Custom',
  stateManagement: 'Redux',
  testingFramework: 'Jest',
  packageManager: 'yarn',
  aiAgent: 'generic',
};

export default mernPreset;
