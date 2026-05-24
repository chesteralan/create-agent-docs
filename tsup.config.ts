import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true, // Injects ESM shims for import.meta.url / __dirname
  sourcemap: true,
  minify: false,
  target: 'node20',
  bundle: true,
});
