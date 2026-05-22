import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectConfig } from '../types/index.js';

/**
 * Load a preset configuration by name.
 * Returns the partial ProjectConfig defined in the preset file, or undefined if the preset does not exist.
 */
export async function loadPreset(name: string): Promise<Partial<ProjectConfig> | undefined> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const presetFile = path.resolve(__dirname, `../presets/${name}.ts`);
  try {
    const module = await import(presetFile);
    // Most preset files export a default object
    if (module && module.default) {
      return module.default as Partial<ProjectConfig>;
    }
    // Fallback: try named export like `${name}Preset`
    const named = module[`${name}Preset`];
    if (named) {
      return named as Partial<ProjectConfig>;
    }
    return undefined;
  } catch (err) {
    // If the file cannot be found or any error occurs, treat as unknown preset
    return undefined;
  }
}
