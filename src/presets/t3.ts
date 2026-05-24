import type { ProjectConfig } from '../types/index.js';

export const t3Preset: Partial<ProjectConfig> = {
  projectName: 'my-t3-app',
  frontendFramework: 'Next.js',
  backend: 'None',
  database: 'PostgreSQL',
  authProvider: 'NextAuth',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default t3Preset;
