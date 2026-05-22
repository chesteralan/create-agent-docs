import type { ProjectConfig } from '../types/index.js';

export const nextjsSaasPreset: Partial<ProjectConfig> = {
  projectName: 'my-saas-app',
  frontendFramework: 'Next.js',
  backend: 'None',
  database: 'PostgreSQL',
  authProvider: 'NextAuth',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'yarn',
  aiAgent: 'generic',
};

export default nextjsSaasPreset;
