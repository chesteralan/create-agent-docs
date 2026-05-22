# create-agent-docs

## Presets

The CLI now supports predefined **stack presets** that skip interactive prompts and generate documentation for common tech stacks.

```bash
# Generate docs using the Next.js preset
npx create-agent-docs generate --preset nextjs

# Vue preset
npx create-agent-docs generate --preset vue

# Angular preset
npx create-agent-docs generate --preset angular

# Firebase (server‑less) preset
npx create-agent-docs generate --preset firebase
```

**Available presets**:
- `nextjs` – Next.js frontend with optional API routes.
- `vue` – Vue 3 + Vite setup.
- `angular` – Angular CLI based project.
- `firebase` – Firebase (Firestore, Auth, Hosting) backend.

When a preset is supplied, the CLI loads the preset configuration, prints a banner like:
```
[preset] Using "Next.js" preset – skipping interactive prompts.
```
All additional flags (`--force`, `--dry-run`, `--output`) still apply.

---

<!-- Existing README content continues below -->
