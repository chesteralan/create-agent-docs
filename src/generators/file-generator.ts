import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate } from './template-engine.js';
import { logger } from '../utils/logger.js';
import { backupExisting } from '../generators/backup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE_DIR = join(__dirname, '../templates');

export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  targetDir?: string;
}

interface TemplateFile {
  name: string;
  template: string;
  root?: boolean;
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

  logger.info(`Generating documentation files in ${logger.bold(docsDir)}...`);

  if (!options.dryRun && !options.force && fs.existsSync(docsDir)) {
    // If docs folder exists and force is not set, we'll run pre-checks
    logger.warn(
      `Directory 'docs' already exists. Use ${logger.bold('--force')} to overwrite existing files.`,
    );
  }

  if (!options.dryRun) {
    fs.ensureDirSync(docsDir);
  }

  const allTemplates = [...TEMPLATES, ...getAgentTemplates(config)];

  for (const file of allTemplates) {
    const templatePath = join(TEMPLATE_DIR, file.template);
    const outputDir = file.root ? targetDir : docsDir;
    const outputPath = join(outputDir, file.name);

    if (!fs.existsSync(templatePath)) {
      logger.error(`Template not found: ${file.template} at ${templatePath}`);
      continue;
    }

    try {
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const rendered = renderTemplate(templateContent, config as unknown as Record<string, any>);

      if (options.dryRun) {
        const relPath = file.root ? file.name : join('docs', file.name);
        logger.info(`[Dry-Run] Would write: ${logger.bold(relPath)}`);
        // Log a tiny preview snippet (first 3 lines or description)
        const lines = rendered.trim().split('\n').slice(0, 3).join('\n');
        console.log(logger.bold('--- Preview ---'));
        console.log(lines + '\n...\n' + logger.bold('---------------'));
      } else {
        const relPath = file.root ? file.name : join('docs', file.name);
        const fileExists = fs.existsSync(outputPath);
        if (fileExists) {
          if (options.force) {
            // Backup existing file before overwriting
            await backupExisting(outputPath);
            logger.info(`Overwriting existing file: ${relPath}`);
            fs.writeFileSync(outputPath, rendered, 'utf8');
            logger.success(`Created (overwritten): ${relPath}`);
          } else {
            logger.warn(
              `Skipping existing file: ${relPath} (use --force to overwrite)`,
            );
            continue;
          }
        } else {
          fs.writeFileSync(outputPath, rendered, 'utf8');
          logger.success(`Created: ${relPath}`);
        }
      }
    } catch (err: any) {
      logger.error(`Failed to generate ${file.name}: ${err.message || err}`);
    }
  }
}
