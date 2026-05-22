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

  for (const file of TEMPLATES) {
    const templatePath = join(TEMPLATE_DIR, file.template);
    const outputPath = join(docsDir, file.name);

    if (!fs.existsSync(templatePath)) {
      logger.error(`Template not found: ${file.template} at ${templatePath}`);
      continue;
    }

    try {
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const rendered = renderTemplate(templateContent, config as unknown as Record<string, any>);

      if (options.dryRun) {
        logger.info(`[Dry-Run] Would write: ${logger.bold(join('docs', file.name))}`);
        // Log a tiny preview snippet (first 3 lines or description)
        const lines = rendered.trim().split('\n').slice(0, 3).join('\n');
        console.log(logger.bold('--- Preview ---'));
        console.log(lines + '\n...\n' + logger.bold('---------------'));
      } else {
        const fileExists = fs.existsSync(outputPath);
        if (fileExists) {
          if (options.force) {
            // Backup existing file before overwriting
            await backupExisting(outputPath);
            logger.info(`Overwriting existing file: ${join('docs', file.name)}`);
            fs.writeFileSync(outputPath, rendered, 'utf8');
            logger.success(`Created (overwritten): ${join('docs', file.name)}`);
          } else {
            logger.warn(
              `Skipping existing file: ${join('docs', file.name)} (use --force to overwrite)`,
            );
            continue;
          }
        } else {
          fs.writeFileSync(outputPath, rendered, 'utf8');
          logger.success(`Created: ${join('docs', file.name)}`);
        }
      }
    } catch (err: any) {
      logger.error(`Failed to generate ${file.name}: ${err.message || err}`);
    }
  }
}
