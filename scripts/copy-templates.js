import fs from 'fs-extra';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, '../src/templates');
const destDir = join(__dirname, '../dist/templates');

try {
  fs.ensureDirSync(destDir);
  fs.copySync(srcDir, destDir, { overwrite: true });
  console.log('✔ Templates successfully copied to dist/templates');
} catch (err) {
  console.error(`✖ Failed to copy templates: ${err.message || err}`);
  process.exit(1);
}
