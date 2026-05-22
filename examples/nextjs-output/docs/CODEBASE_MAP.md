# Codebase Map — my-nextjs-app

This directory structure outlines where folders and files reside and details their primary purpose. Keep it updated as directories are added or refactored.

---

## 📂 Directory Layout

```txt
my-nextjs-app/
├── docs/                      # AI-ready documentation (this folder)
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, route handlers)
│   ├── components/            # Reusable UI component library (atoms, molecules)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Config configurations (database clients, auth SDKs)
│   └── types/                 # Custom type declarations
├── tests/                     # Test suite specs (Jest)
├── package.json               # Package setup and dependencies
└── tsconfig.json              # TypeScript compilation rules
```

---

## 🔍 Folder Contexts

### `docs/`
Contains architectural documents, glossary terms, and instructions for developers and AI agents. Keep files up to date when changing APIs or rules.

### `src/components/`
Every component should be self-contained in a folder, containing the markup, layout styling, and standard documentation (e.g. `components/Button/Button.tsx`).

