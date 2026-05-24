import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let currentLocale: Record<string, any> = {};
let currentLang: string = 'en';

export function loadLocale(lang: string = 'en', localeDir?: string): Record<string, any> {
  currentLang = lang;
  const dir = localeDir || resolveLocaleDir();
  const localePath = path.join(dir, `${lang}.json`);
  try {
    currentLocale = fs.readJsonSync(localePath);
  } catch {
    const fallback = path.join(dir, 'en.json');
    currentLocale = fs.readJsonSync(fallback);
    currentLang = 'en';
  }
  return currentLocale;
}

function resolveLocaleDir(): string {
  const devDir = path.join(__dirname, '../locales');
  if (fs.existsSync(devDir)) return devDir;
  return path.join(__dirname, 'locales');
}

export function t(key: string, vars?: Record<string, string>): string {
  const keys = key.split('.');
  let value: any = currentLocale;
  for (const k of keys) {
    value = value?.[k];
  }
  const str = typeof value === 'string' ? value : key;
  if (vars) {
    return str.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? `{${v}}`);
  }
  return str;
}

export function getCurrentLang(): string {
  return currentLang;
}

export function getCurrentLocale(): Record<string, any> {
  return currentLocale;
}
