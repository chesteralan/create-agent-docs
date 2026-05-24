import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import ora from 'ora';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate, loadStackPartials } from './template-engine.js';
import { logger, isCI } from '../utils/logger.js';
import { debugLog } from '../utils/debug.js';
import { backupExisting } from '../generators/backup.js';
import { getCurrentLocale } from '../utils/locale.js';
import { loadPlugins } from '../plugins/loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE_DIR = (() => {
  const dev = join(__dirname, '../templates');
  if (fs.existsSync(dev)) return dev;
  return join(__dirname, 'templates');
})();

let cachedVersion: string = '0.0.0';

function getCliVersion(): string {
  if (cachedVersion === '0.0.0') {
    try {
      const pkg = fs.readJsonSync(join(__dirname, '../../package.json'));
      cachedVersion = pkg.version || '0.0.0';
    } catch {
      cachedVersion = '0.0.0';
    }
  }
  return cachedVersion;
}

async function formatMarkdown(content: string): Promise<string> {
  try {
    const prettier = await import('prettier');
    return await prettier.format(content, { parser: 'markdown' });
  } catch {
    return content;
  }
}

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  yes?: boolean;
  targetDir?: string;
  noSpinner?: boolean;
  noFormat?: boolean;
  maxBackups?: number;
  scaffold?: string;
  git?: boolean;
}

interface TemplateFile {
  name: string;
  template: string;
  root?: boolean;
}

interface FileResult {
  relPath: string;
  status: 'Created' | 'Overwritten' | 'Skipped' | 'Failed' | 'Dry-Run';
  size?: string;
}

const TEMPLATES: TemplateFile[] = [
  { name: 'AGENTS.md', template: 'AGENTS.md.hbs' },
  { name: 'ARCHITECTURE.md', template: 'ARCHITECTURE.md.hbs' },
  { name: 'CODEBASE_MAP.md', template: 'CODEBASE_MAP.md.hbs' },
  { name: 'BUSINESS_RULES.md', template: 'BUSINESS_RULES.md.hbs' },
  { name: 'API_CONTRACTS.md', template: 'API_CONTRACTS.md.hbs' },
  { name: 'UI_PATTERNS.md', template: 'UI_PATTERNS.md.hbs' },
  { name: 'REFACTOR_RULES.md', template: 'REFACTOR_RULES.md.hbs' },
  { name: 'GLOSSARY.md', template: 'GLOSSARY.md.hbs' },
  { name: 'TASKS.md', template: 'TASKS.md.hbs' },
  { name: 'REFACTORING.md', template: 'REFACTORING.md.hbs' },
];

const STANDARD_TEMPLATES: TemplateFile[] = [
  { name: 'README.md', template: 'README.md.hbs' },
  { name: 'CHANGELOG.md', template: 'CHANGELOG.md.hbs' },
  { name: 'CONTRIBUTING.md', template: 'CONTRIBUTING.md.hbs' },
  { name: 'CODE_OF_CONDUCT.md', template: 'CODE_OF_CONDUCT.md.hbs' },
  { name: 'SECURITY.md', template: 'SECURITY.md.hbs' },
  { name: 'LICENSE', template: 'LICENSE.hbs' },
];

const CICD_TEMPLATES: TemplateFile[] = [
  { name: '.github/workflows/ci.yml', template: 'workflows/ci.yml.hbs', root: true },
  { name: 'Dockerfile', template: 'Dockerfile.hbs' },
  { name: 'docker-compose.yml', template: 'docker-compose.yml.hbs' },
];

function getAgentTemplates(config: ProjectConfig): TemplateFile[] {
  const agent = config.aiAgent;
  if (agent === 'cursor') {
    return [{ name: '.cursorrules', template: '.cursorrules.hbs', root: true }];
  }
  if (agent === 'claude') {
    return [{ name: 'CLAUDE.md', template: 'CLAUDE.md.hbs', root: true }];
  }
  return [
    { name: '.cursorrules', template: '.cursorrules.hbs', root: true },
    { name: 'CLAUDE.md', template: 'CLAUDE.md.hbs', root: true },
  ];
}

/**
 * Generates the agent-docs structure based on the project configuration
 */
export async function generateDocs(config: ProjectConfig, options: GenerateOptions = {}) {
  const targetDir = options.targetDir || process.cwd();
  const docsDir = join(targetDir, 'docs');

  debugLog('generateDocs', { targetDir, docsDir, dryRun: options.dryRun, force: options.force, yes: options.yes });

  const results: FileResult[] = [];

  const useSpinner = !isCI() && !options.noSpinner;

  const spinner = useSpinner
    ? ora({
        text: `Generating documentation files in ${logger.bold(docsDir)}...`,
        color: 'blue',
      }).start()
    : null;

  if (!options.dryRun) {
    try {
      fs.ensureDirSync(docsDir);
    } catch (err: any) {
      if (spinner) spinner.fail(`Cannot create output directory: ${err.message || err}`);
      else logger.error(`Cannot create output directory: ${err.message || err}`);
      return;
    }
  }

  const plugins = await loadPlugins();

  for (const plugin of plugins) {
    if (plugin.hooks.beforeGenerate) {
      const result = await plugin.hooks.beforeGenerate(config, options);
      config = result.config;
      options = result.options;
    }
  }

  let allTemplates = [...TEMPLATES, ...getAgentTemplates(config)];

  if (config.generateStandardDocs) {
    allTemplates = [...allTemplates, ...STANDARD_TEMPLATES];
  }

  if (config.generateCicd) {
    const cicd = CICD_TEMPLATES.filter(t => {
      if (t.name === 'Dockerfile' && config.generateDockerfile === false) return false;
      if (t.name === 'docker-compose.yml' && config.generateDockerCompose === false) return false;
      if (t.name === '.github/workflows/ci.yml' && config.cicdProvider === 'none') return false;
      return true;
    });
    allTemplates = [...allTemplates, ...cicd];
  }

  if (config.templateOverrides) {
    for (const [filename, templatePath] of Object.entries(config.templateOverrides)) {
      const resolvedPath = path.isAbsolute(templatePath)
        ? templatePath
        : join(targetDir, templatePath);
      if (!fs.existsSync(resolvedPath)) {
        logger.warn(`Custom template path not found: ${templatePath} (resolved: ${resolvedPath})`);
      }
      const idx = allTemplates.findIndex(t => t.name === filename);
      if (idx >= 0) {
        allTemplates[idx] = { ...allTemplates[idx], template: templatePath };
        logger.info(`Template override: ${filename} -> ${templatePath}`);
      } else {
        allTemplates.push({ name: filename, template: templatePath });
      }
    }
  }

  loadStackPartials(config.frontendFramework, config.backend);

  for (const file of allTemplates) {
    const templatePath = path.isAbsolute(file.template)
      ? file.template
      : fs.existsSync(join(targetDir, file.template))
        ? join(targetDir, file.template)
        : join(TEMPLATE_DIR, file.template);
    const outputDir = file.root ? targetDir : docsDir;
    const outputPath = join(outputDir, file.name);
    const relPath = file.root ? file.name : join('docs', file.name);

    if (!options.dryRun) {
      fs.ensureDirSync(path.dirname(outputPath));
    }

    if (spinner) spinner.text = `Processing ${relPath}...`;
    else logger.info(`Processing ${relPath}...`);

    if (!fs.existsSync(templatePath)) {
      if (spinner) spinner.fail(`Template not found: ${file.template}`);
      else logger.error(`Template not found: ${file.template}`);
      results.push({ relPath, status: 'Failed' });
      continue;
    }

    try {
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      debugLog('Rendering template', file.template, templateContent.length, 'bytes');
      const renderContext = {
        ...config,
        generatedDate: new Date().toISOString().split('T')[0],
        cliVersion: getCliVersion(),
        locale: getCurrentLocale().templates || {},
      } as unknown as Record<string, any>;

      let renderTemplateContent = templateContent;
      let renderContextFinal = renderContext;
      for (const plugin of plugins) {
        if (plugin.hooks.beforeRender) {
          const result = await plugin.hooks.beforeRender(renderTemplateContent, renderContextFinal, file.name);
          renderTemplateContent = result.template;
          renderContextFinal = result.context;
        }
      }

      let rendered = renderTemplate(renderTemplateContent, renderContextFinal);

      for (const plugin of plugins) {
        if (plugin.hooks.afterRender) {
          rendered = await plugin.hooks.afterRender(rendered, file.name);
        }
      }
      if (!options.noFormat && file.name.endsWith('.md')) {
        rendered = await formatMarkdown(rendered);
      }
      const versionedContent = `<!-- template-version: ${getCliVersion()} -->\n\n${rendered}`;
      const size = Buffer.byteLength(versionedContent, 'utf8').toString();

      if (options.dryRun) {
        if (spinner) spinner.info(`[Dry-Run] Would write: ${logger.bold(relPath)}`);
        else logger.info(`[Dry-Run] Would write: ${logger.bold(relPath)}`);
        const lines = versionedContent.trim().split('\n').slice(0, 3).join('\n');
        console.log(logger.bold('--- Preview ---'));
        console.log(lines + '\n...\n' + logger.bold('---------------'));
        results.push({ relPath, status: 'Dry-Run', size });
      } else {
        const fileExists = fs.existsSync(outputPath);
        if (fileExists && !options.force && !options.yes) {
          if (spinner) spinner.info(`Skipped: ${relPath}`);
          else logger.info(`Skipped: ${relPath}`);
          results.push({ relPath, status: 'Skipped' });
          continue;
        }
        if (fileExists) {
          await backupExisting(outputPath, options.maxBackups);
          fs.writeFileSync(outputPath, versionedContent, 'utf8');
          if (spinner) spinner.succeed(`Overwritten: ${relPath}`);
          else logger.success(`Overwritten: ${relPath}`);
          results.push({ relPath, status: 'Overwritten', size });
        } else {
          fs.writeFileSync(outputPath, versionedContent, 'utf8');
          if (spinner) spinner.succeed(`Created: ${relPath}`);
          else logger.success(`Created: ${relPath}`);
          results.push({ relPath, status: 'Created', size });
        }
      }
    } catch (err: any) {
      if (spinner) spinner.fail(`Failed to generate ${file.name}: ${err.message || err}`);
      else logger.error(`Failed to generate ${file.name}: ${err.message || err}`);
      results.push({ relPath, status: 'Failed' });
    }
  }

  if (spinner) spinner.stop();
  printSummary(results, options.dryRun);

  for (const plugin of plugins) {
    if (plugin.hooks.afterGenerate) {
      await plugin.hooks.afterGenerate(results);
    }
  }

  if (!options.dryRun) {
    if (options.scaffold) {
      await scaffoldProject(options.scaffold);
    }

    if (options.git) {
      const { initGitRepo, createDefaultGitignore } = await import('../utils/git.js');
      const initialized = initGitRepo(targetDir);
      if (initialized) {
        createDefaultGitignore(targetDir);
        logger.success('Initialized git repository');
      } else {
        logger.info('Already a git repository');
      }
    }
  }
}

export async function scaffoldProject(scaffoldDir: string): Promise<void> {
  const dirs = [
    'src/components',
    'src/pages',
    'src/utils',
    'src/styles',
    'src/api',
  ];
  for (const d of dirs) {
    fs.ensureDirSync(path.join(scaffoldDir, d));
  }
  const placeholders: Record<string, string> = {
    'src/index.js': '// Main entry point\n',
    'src/utils/helpers.js': '// Utility functions\n',
    'src/styles/main.css': '/* Main stylesheet */\n',
  };
  for (const [file, content] of Object.entries(placeholders)) {
    const filePath = path.join(scaffoldDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  }
  logger.success(`Scaffolded project structure in ${scaffoldDir}`);
}

function printSummary(results: FileResult[], dryRun?: boolean): void {
  logger.header(dryRun ? 'Dry-Run Summary' : 'Generation Summary');
  const created = results.filter(r => r.status === 'Created').length;
  const overwritten = results.filter(r => r.status === 'Overwritten').length;
  const skipped = results.filter(r => r.status === 'Skipped').length;
  const failed = results.filter(r => r.status === 'Failed').length;
  const dryRunCount = results.filter(r => r.status === 'Dry-Run').length;
  const parts: string[] = [];
  if (created) parts.push(`${created} created`);
  if (overwritten) parts.push(`${overwritten} overwritten`);
  if (skipped) parts.push(`${skipped} skipped`);
  if (failed) parts.push(`${failed} failed`);
  if (dryRun && dryRunCount) parts.push(`${dryRunCount} would be written`);
  logger.info(`${parts.join(', ')}.`);
  if (results.some(r => r.status === 'Failed')) {
    logger.warn('Some files failed to generate. Check the errors above.');
  }
}
