import type { ProjectConfig } from '../types/index.js';

export const nextjsPreset: Partial<ProjectConfig> = {
  projectName: 'my-nextjs-app',
  frontendFramework: 'Next.js',
  backend: 'None',
  database: 'None',
  authProvider: 'NextAuth',
  stateManagement: 'Redux',
  testingFramework: 'Jest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default nextjsPreset;
