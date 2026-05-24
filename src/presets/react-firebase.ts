import type { ProjectConfig } from '../types/index.js';

export const reactFirebasePreset: Partial<ProjectConfig> = {
  projectName: 'my-react-firebase-app',
  frontendFramework: 'React + Vite',
  backend: 'Firebase',
  database: 'Firestore',
  authProvider: 'Firebase Auth',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

export default reactFirebasePreset;
