import type { ProjectConfig } from '../types/index.js';
import type { GenerateOptions } from '../generators/file-generator.js';

export interface PluginHooks {
  beforeGenerate?: (config: ProjectConfig, options: GenerateOptions) => Promise<{ config: ProjectConfig; options: GenerateOptions }>;
  afterGenerate?: (results: Array<{ relPath: string; status: string }>) => Promise<void>;
  beforeRender?: (template: string, context: Record<string, any>, fileName: string) => Promise<{ template: string; context: Record<string, any> }>;
  afterRender?: (content: string, fileName: string) => Promise<string>;
}

export interface CreateAgentDocsPlugin {
  name: string;
  version?: string;
  description?: string;
  hooks: PluginHooks;
  presets?: Record<string, Partial<ProjectConfig>>;
  templates?: Record<string, string>;
}
