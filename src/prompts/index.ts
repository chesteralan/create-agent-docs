import { input, select } from '@inquirer/prompts';
import fs from 'fs-extra';
import { ProjectConfig } from '../types/index.js';
import { validators } from '../utils/validation.js';

export async function promptProjectConfig(): Promise<ProjectConfig> {
  // Resolve default project name from package.json (fallback to "my-app")
  const getDefaultProjectName = (): string => {
    try {
      const pkg = fs.readJsonSync('package.json');
      return pkg.name ?? 'my-app';
    } catch {
      return 'my-app';
    }
  };
  const projectName = await input({
    message: 'What is your project name?',
    default: getDefaultProjectName(),
    validate: validators.projectName,
  });

  const frontendFramework = await select({
    message: 'Select a Frontend Framework:',
    choices: [
      { name: 'React + Vite', value: 'React + Vite' },
      { name: 'Next.js', value: 'Next.js' },
      { name: 'Vue', value: 'Vue' },
      { name: 'Angular', value: 'Angular' },
      { name: 'None (Pure Backend / HTML)', value: 'None' },
    ],
  });

  const backend = await select({
    message: 'Select a Backend Framework/Service:',
    choices: [
      { name: 'Node.js Express', value: 'Express' },
      { name: 'NestJS', value: 'NestJS' },
      { name: 'FastAPI', value: 'FastAPI' },
      { name: 'Firebase (Serverless)', value: 'Firebase' },
      { name: 'None (Jamstack / Client-only)', value: 'None' },
    ],
  });

  const database = await select({
    message: 'Select a Database:',
    choices: [
      { name: 'PostgreSQL', value: 'PostgreSQL' },
      { name: 'MongoDB', value: 'MongoDB' },
      { name: 'Cloud Firestore (Firebase)', value: 'Firestore' },
      { name: 'SQLite', value: 'SQLite' },
      { name: 'None', value: 'None' },
    ],
  });

  const authProvider = await select({
    message: 'Select an Authentication Provider:',
    choices: [
      { name: 'Firebase Authentication', value: 'Firebase Auth' },
      { name: 'NextAuth / Auth.js', value: 'NextAuth' },
      { name: 'Auth0', value: 'Auth0' },
      { name: 'Custom JWT / Session-based', value: 'Custom' },
      { name: 'None', value: 'None' },
    ],
  });

  const stateManagement = await select({
    message: 'Select a State Management solution:',
    choices: [
      { name: 'Zustand (Recommended for React)', value: 'Zustand' },
      { name: 'Redux Toolkit', value: 'Redux' },
      { name: 'React Context API', value: 'React Context' },
      { name: 'Pinia (Vue)', value: 'Pinia' },
      { name: 'None', value: 'None' },
    ],
  });

  const testingFramework = await select({
    message: 'Select a Testing Framework:',
    choices: [
      { name: 'Vitest (Fast unit testing)', value: 'Vitest' },
      { name: 'Jest', value: 'Jest' },
      { name: 'Playwright (End-to-End)', value: 'Playwright' },
      { name: 'None', value: 'None' },
    ],
  });

  const packageManager = await select({
    message: 'Select a Package Manager:',
    choices: [
      { name: 'Yarn', value: 'yarn' },
      { name: 'npm', value: 'npm' },
      { name: 'pnpm', value: 'pnpm' },
      { name: 'Bun', value: 'bun' },
    ],
  });

  return {
    projectName,
    frontendFramework,
    backend,
    database,
    authProvider,
    stateManagement,
    testingFramework,
    packageManager,
  };
}
