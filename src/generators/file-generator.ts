import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ora from 'ora';
import { confirm } from '@inquirer/prompts';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate } from './template-engine.js';
import { logger, isCI } from '../utils/logger.js';
import { debugLog } from '../utils/debug.js';
import { backupExisting } from '../generators/backup.js';
import { ensureGitignoreEntry } from '../utils/gitignore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE_DIR = join(__dirname, '../templates');

let cachedVersion: string | undefined;

function getCliVersion(): string {
  if (!cachedVersion) {
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

  const allTemplates = [...TEMPLATES, ...getAgentTemplates(config)];

  for (const file of allTemplates) {
    const templatePath = join(TEMPLATE_DIR, file.template);
    const outputDir = file.root ? targetDir : docsDir;
    const outputPath = join(outputDir, file.name);
    const relPath = file.root ? file.name : join('docs', file.name);

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
      } as unknown as Record<string, any>;
      let rendered = renderTemplate(templateContent, renderContext);
      if (!options.noFormat && file.name.endsWith('.md')) {
        rendered = await formatMarkdown(rendered);
      }
      const size = Buffer.byteLength(rendered, 'utf8').toString();

      if (options.dryRun) {
        if (spinner) spinner.info(`[Dry-Run] Would write: ${logger.bold(relPath)}`);
        else logger.info(`[Dry-Run] Would write: ${logger.bold(relPath)}`);
        const lines = rendered.trim().split('\n').slice(0, 3).join('\n');
        console.log(logger.bold('--- Preview ---'));
        console.log(lines + '\n...\n' + logger.bold('---------------'));
        results.push({ relPath, status: 'Dry-Run', size });
      } else {
        const fileExists = fs.existsSync(outputPath);
        if (fileExists && !options.force && !options.yes) {
          let answer = false;
          if (process.stdout.isTTY) {
            if (spinner) spinner.stop();
            answer = await confirm({
              message: `${relPath} already exists. Overwrite?`,
              default: false,
            });
            if (spinner) spinner.start();
          }
          if (!answer) {
            if (spinner) spinner.info(`Skipped: ${relPath}`);
            else logger.info(`Skipped: ${relPath}`);
            results.push({ relPath, status: 'Skipped' });
            continue;
          }
          await backupExisting(outputPath);
          fs.writeFileSync(outputPath, rendered, 'utf8');
          if (spinner) spinner.succeed(`Overwritten: ${relPath}`);
          else logger.success(`Overwritten: ${relPath}`);
          results.push({ relPath, status: 'Overwritten', size });
        } else if (fileExists) {
          await backupExisting(outputPath);
          fs.writeFileSync(outputPath, rendered, 'utf8');
          if (spinner) spinner.succeed(`Overwritten: ${relPath}`);
          else logger.success(`Overwritten: ${relPath}`);
          results.push({ relPath, status: 'Overwritten', size });
        } else {
          fs.writeFileSync(outputPath, rendered, 'utf8');
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

  if (!options.dryRun) {
    await offerDocsScript(targetDir);
    await offerGitignoreEntries(targetDir);
  }
}

async function offerDocsScript(projectDir: string): Promise<void> {
  const pkgPath = join(projectDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  let pkg: Record<string, any>;
  try {
    pkg = fs.readJsonSync(pkgPath);
  } catch {
    return;
  }

  if (pkg.scripts?.['docs:generate']) return;

  let answer = false;
  if (process.stdout.isTTY) {
    answer = await confirm({
      message: 'Add "docs:generate" script to package.json?',
      default: false,
    });
  }

  if (answer) {
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['docs:generate'] = 'create-agent-docs generate';
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
    logger.success('Added "docs:generate" script to package.json');
  }
}

async function offerGitignoreEntries(projectDir: string): Promise<void> {
  if (!process.stdout.isTTY) return;

  const addBackup = await confirm({
    message: 'Add .backup/ to .gitignore?',
    default: true,
  });
  if (addBackup) {
    ensureGitignoreEntry(projectDir, '.backup/');
    logger.success('Added .backup/ to .gitignore');
  }

  const addDocs = await confirm({
    message: 'Should docs/ be added to .gitignore? (N = commit docs to repo)',
    default: false,
  });
  if (addDocs) {
    ensureGitignoreEntry(projectDir, 'docs/');
    logger.success('Added docs/ to .gitignore');
  }
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
