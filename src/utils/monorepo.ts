import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';

export interface MonorepoPackage {
  name: string;
  dir: string;
  packageJson: Record<string, any>;
}

export function detectMonorepo(rootDir: string = process.cwd()): MonorepoPackage[] | null {
  const pkgPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;

  let pkg: Record<string, any>;
  try {
    pkg = fs.readJsonSync(pkgPath);
  } catch {
    return null;
  }

  const workspaces = pkg.workspaces;
  if (!workspaces) return null;

  const patterns: string[] = Array.isArray(workspaces) ? workspaces : workspaces.packages || [];

  if (patterns.length === 0) return null;

  const packages: MonorepoPackage[] = [];

  for (const pattern of patterns) {
    const matched = globSync(pattern, { cwd: rootDir });
    for (const match of matched) {
      const pkgJsonPath = path.join(rootDir, match, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgJson = fs.readJsonSync(pkgJsonPath);
          packages.push({
            name: pkgJson.name || path.basename(match),
            dir: path.resolve(rootDir, match),
            packageJson: pkgJson,
          });
        } catch {
          // skip invalid package.json
        }
      }
    }
  }

  return packages.length > 0 ? packages : null;
}

export function getPerPackageConfig(pkg: MonorepoPackage): Record<string, any> | null {
  const config = pkg.packageJson['create-agent-docs'];
  return config || null;
}
