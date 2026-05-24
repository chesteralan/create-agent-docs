import Handlebars from 'handlebars';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { debugLog } from '../utils/debug.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PARTIALS_DIR = (() => {
  const dev = join(__dirname, '../templates/partials');
  if (fs.existsSync(dev)) return dev;
  return join(__dirname, 'templates/partials');
})();
const STACK_PARTIALS_DIR = join(PARTIALS_DIR, 'stack');

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

function evaluateCondition(context: any, isTrue: boolean, options: any) {
  if (options && typeof options.fn === 'function') {
    return isTrue ? options.fn(context) : options.inverse(context);
  }
  return isTrue;
}

Handlebars.registerHelper('eq', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, a === b, options);
});

Handlebars.registerHelper('ne', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, a !== b, options);
});

Handlebars.registerHelper('or', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, !!(a || b), options);
});

Handlebars.registerHelper('and', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, !!(a && b), options);
});

Handlebars.registerHelper('not', function (this: any, a: any, options: any) {
  return evaluateCondition(this, !a, options);
});

function loadPartials(): void {
  try {
    if (fs.existsSync(PARTIALS_DIR)) {
      const files = fs.readdirSync(PARTIALS_DIR);
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const name = file.replace(/\.hbs$/, '');
          const content = fs.readFileSync(join(PARTIALS_DIR, file), 'utf8');
          Handlebars.registerPartial(name, content);
        }
      }
    }
  } catch {
    // partials are optional
  }
}

function normalizeStackName(stack: string): string {
  return stack.toLowerCase().replace(/[+\s]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function loadStackPartials(frontendFramework: string, backend: string): void {
  try {
    if (!fs.existsSync(STACK_PARTIALS_DIR)) return;
    const stacks = [frontendFramework, backend].filter(s => s && s !== 'None');
    for (const stack of stacks) {
      const name = normalizeStackName(stack);
      const filePath = join(STACK_PARTIALS_DIR, `${name}.hbs`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        Handlebars.registerPartial(`stack-${name}`, content);
        debugLog('Registered stack partial', `stack-${name}`);
      }
    }
  } catch {
    // stack partials are optional
  }
}

loadPartials();

/**
 * Render a Handlebars template string with the given context data.
 * Templates are compiled and cached for performance. Built-in helpers include
 * `eq`, `ne`, `or`, `and`, and `not` for conditional logic.
 * @param templateContent - Raw Handlebars template string
 * @param context - Data object with values to interpolate
 * @returns Rendered output string
 */
export function renderTemplate(templateContent: string, context: Record<string, any>): string {
  let compiled = templateCache.get(templateContent);
  if (!compiled) {
    debugLog('Compiling template', templateContent.length, 'bytes');
    try {
      compiled = Handlebars.compile(templateContent);
    } catch (err: any) {
      throw new Error(`Template syntax error: ${err.message || String(err)}`, { cause: err });
    }
    templateCache.set(templateContent, compiled);
  } else {
    debugLog('Using cached template', templateContent.length, 'bytes');
  }
  return compiled(context);
}

/** Clear the compiled template cache. Useful after template changes in watch mode. */
export function clearTemplateCache(): void {
  templateCache.clear();
}
