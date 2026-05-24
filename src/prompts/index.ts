import { input, select } from '@inquirer/prompts';
import fs from 'fs-extra';
import type { ProjectConfig } from '../types/index.js';
import { validators } from '../utils/validation.js';
import { t } from '../utils/locale.js';

/**
 * Run the interactive prompt flow to gather project configuration.
 * Each prompt is pre-filled from `overrides` when available, skipping
 * prompts that already have a value.
 * @param overrides - Pre-filled config values to skip certain prompts
 * @returns Complete project configuration from user input and overrides
 */
export async function promptProjectConfig(
  overrides: Partial<ProjectConfig> = {},
): Promise<ProjectConfig> {
  // Resolve default project name from package.json (fallback to "my-app")
  const getDefaultProjectName = (): string => {
    try {
      const pkg = fs.readJsonSync('package.json');
      return pkg.name ?? 'my-app';
    } catch {
      return 'my-app';
    }
  };

  const projectName =
    overrides.projectName ??
    (await input({
      message: t('prompts.projectName'),
      default: getDefaultProjectName(),
      validate: validators.projectName,
    }));

  const projectDescription =
    overrides.projectDescription ??
    (await input({
      message: t('prompts.projectDescription'),
      default: '',
    }));

  const frontendFramework =
    overrides.frontendFramework ??
    (await select({
      message: t('prompts.frontendFramework'),
      choices: [
        { name: 'React + Vite', value: 'React + Vite' },
        { name: 'Next.js', value: 'Next.js' },
        { name: 'Vue', value: 'Vue' },
        { name: 'Angular', value: 'Angular' },
        { name: 'None (Pure Backend / HTML)', value: 'None' },
      ],
    }));

  const backend =
    overrides.backend ??
    (await select({
      message: t('prompts.backend'),
      choices: [
        { name: 'Firebase (Serverless)', value: 'Firebase' },
        { name: 'Node.js Express', value: 'Express' },
        { name: 'NestJS', value: 'NestJS' },
        { name: 'FastAPI', value: 'FastAPI' },
        { name: 'None (Jamstack / Client-only)', value: 'None' },
      ],
    }));

  const database =
    overrides.database ??
    (await select({
      message: t('prompts.database'),
      choices: [
        { name: 'Cloud Firestore (Firebase)', value: 'Firestore' },
        { name: 'PostgreSQL', value: 'PostgreSQL' },
        { name: 'MongoDB', value: 'MongoDB' },
        { name: 'SQLite', value: 'SQLite' },
        { name: 'None', value: 'None' },
      ],
    }));

  const authProvider =
    overrides.authProvider ??
    (await select({
      message: t('prompts.authProvider'),
      choices: [
        { name: 'Firebase Authentication', value: 'Firebase Auth' },
        { name: 'NextAuth / Auth.js', value: 'NextAuth' },
        { name: 'Auth0', value: 'Auth0' },
        { name: 'Custom JWT / Session-based', value: 'Custom' },
        { name: 'None', value: 'None' },
      ],
    }));

  const stateManagement =
    overrides.stateManagement ??
    (await select({
      message: t('prompts.stateManagement'),
      choices: [
        { name: 'Zustand (Recommended for React)', value: 'Zustand' },
        { name: 'Redux Toolkit', value: 'Redux' },
        { name: 'React Context API', value: 'React Context' },
        { name: 'Pinia (Vue)', value: 'Pinia' },
        { name: 'None', value: 'None' },
      ],
    }));

  const testingFramework =
    overrides.testingFramework ??
    (await select({
      message: t('prompts.testingFramework'),
      choices: [
        { name: 'Vitest (Fast unit testing)', value: 'Vitest' },
        { name: 'Jest', value: 'Jest' },
        { name: 'Playwright (End-to-End)', value: 'Playwright' },
        { name: 'None', value: 'None' },
      ],
    }));

  const packageManager =
    overrides.packageManager ??
    (await select({
      message: t('prompts.packageManager'),
      choices: [
        { name: 'Yarn', value: 'yarn' },
        { name: 'npm', value: 'npm' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'Bun', value: 'bun' },
      ],
    }));

  return {
    projectName,
    projectDescription: projectDescription || undefined,
    frontendFramework,
    backend,
    database,
    authProvider,
    stateManagement,
    testingFramework,
    packageManager,
    aiAgent: overrides.aiAgent || 'generic',
    generateStandardDocs: overrides.generateStandardDocs,
    license: overrides.license,
    generateCicd: overrides.generateCicd,
    cicdProvider: overrides.cicdProvider,
    generateDockerfile: overrides.generateDockerfile,
    generateDockerCompose: overrides.generateDockerCompose,
  };
}
