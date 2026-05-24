/**
 * Generate AI-ready documentation for a project.
 * @param config - Project configuration describing stack, tools, and agent preferences
 * @param options - Generation options (dry-run, force, target directory, etc.)
 * @returns Promise that resolves when all files have been generated
 *
 * @example
 * ```ts
 * import { generateDocs } from 'create-agent-docs';
 * await generateDocs({
 *   projectName: 'my-app',
 *   frontendFramework: 'React + Vite',
 *   backend: 'Express',
 *   database: 'PostgreSQL',
 *   authProvider: 'Auth0',
 *   stateManagement: 'Zustand',
 *   testingFramework: 'Vitest',
 *   packageManager: 'npm',
 *   aiAgent: 'generic',
 * });
 * ```
 */
export { generateDocs } from './generators/file-generator.js';
export type { GenerateOptions } from './generators/file-generator.js';

/**
 * Load a preset configuration by name.
 * @param name - Preset name (e.g., 'nextjs', 'express', 'firebase')
 * @returns Partial project configuration from the preset
 *
 * @example
 * ```ts
 * import { loadPreset } from 'create-agent-docs';
 * const preset = await loadPreset('nextjs');
 * ```
 */
export { loadPreset, listPresets } from './utils/preset.js';
export type { PresetInfo } from './utils/preset.js';

/**
 * Scan a project directory to auto-detect technology stack configuration.
 * Reads package.json, tsconfig.json, and project structure to infer settings.
 * @param dir - Directory to scan (defaults to current working directory)
 * @returns Scan result with detected configuration values
 *
 * @example
 * ```ts
 * import { scanProject, scanResultToConfig } from 'create-agent-docs';
 * const scan = scanProject('/path/to/project');
 * const config = scanResultToConfig(scan);
 * ```
 */
export { scanProject, scanResultToConfig } from './analyzers/scanner.js';
export type { ScanResult } from './analyzers/scanner.js';

/**
 * Render a Handlebars template string with the given context.
 * Supports built-in helpers: eq, ne, or, and, not.
 * @param template - Handlebars template string
 * @param context - Data object to render into the template
 * @returns Rendered string
 */
export { renderTemplate, clearTemplateCache } from './generators/template-engine.js';

/**
 * Run the interactive prompt flow to gather project configuration from the user.
 * @param overrides - Pre-filled values to skip certain prompts
 * @returns Complete project configuration
 */
export { promptProjectConfig } from './prompts/index.js';

/**
 * Create a timestamped backup of a file before overwriting.
 * Automatically prunes old backups when the count exceeds maxBackups.
 * @param targetPath - Path to the file to back up
 * @param maxBackups - Maximum number of backups to keep (default: 50)
 */
export { backupExisting } from './generators/backup.js';

export type {
  ProjectConfig,
  AiAgent,
  License,
  CiCdProvider,
  FrontendFramework,
  Backend,
  Database,
  AuthProvider,
  StateManagement,
  TestingFramework,
  PackageManager,
} from './types/index.js';

/**
 * Scaffold a basic project directory structure.
 * Creates src/components, src/pages, src/utils, src/styles, src/api
 * with placeholder files.
 * @param scaffoldDir - Directory to scaffold into
 */
export { scaffoldProject } from './generators/file-generator.js';
