import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  shims: true, // Injects ESM shims for import.meta.url / __dirname
  sourcemap: true,
  minify: false,
  target: 'node20',
  bundle: false,
});
