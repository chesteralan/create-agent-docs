export { generateDocs } from './generators/file-generator.js';
export type { GenerateOptions } from './generators/file-generator.js';

export { loadPreset, listPresets } from './utils/preset.js';
export type { PresetInfo } from './utils/preset.js';

export { scanProject, scanResultToConfig } from './analyzers/scanner.js';
export type { ScanResult } from './analyzers/scanner.js';

export { renderTemplate, clearTemplateCache } from './generators/template-engine.js';

export { promptProjectConfig } from './prompts/index.js';

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

export { scaffoldProject } from './generators/file-generator.js';
