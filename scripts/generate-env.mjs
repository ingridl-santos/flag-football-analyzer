/**
 * Build-time equivalent of generate_environment.sh for Vercel deployments.
 *
 * Reads all environment variables whose names start with "PUBLIC_" and writes
 * them into public/environment.js so they are available via window.env at runtime.
 *
 * Usage:
 *   node scripts/generate-env.mjs
 *
 * Called automatically by the `vercel-build` npm script.
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'public', 'environment.js');

const entries = Object.entries(process.env)
  .filter(([key]) => key.startsWith('PUBLIC_'))
  .map(([key, value]) => `  ${key}: '${value}'`)
  .join(',\n');

const content = `window.env = {\n${entries}\n}\n`;

writeFileSync(outputPath, content, 'utf8');

console.log(`[generate-env] wrote ${outputPath}`);
console.log('[generate-env] vars:', Object.keys(process.env).filter((k) => k.startsWith('PUBLIC_')));
