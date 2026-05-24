import fs from 'fs-extra';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatesSrc = join(__dirname, '../src/templates');
const templatesDest = join(__dirname, '../dist/templates');
const localesSrc = join(__dirname, '../src/locales');
const localesDest = join(__dirname, '../dist/locales');
const presetsSrc = join(__dirname, '../src/presets');
const presetsDest = join(__dirname, '../dist/presets');

function copyDir(label, src, dest) {
  try {
    fs.ensureDirSync(dest);
    fs.copySync(src, dest, { overwrite: true });
    console.log(`✔ ${label} successfully copied to ${dest}`);
  } catch (err) {
    console.error(`✖ Failed to copy ${label}: ${err.message || err}`);
    process.exit(1);
  }
}

copyDir('Templates', templatesSrc, templatesDest);
copyDir('Locales', localesSrc, localesDest);
copyDir('Presets', presetsSrc, presetsDest);
