import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Copies @ffmpeg/core-st assets from node_modules into public/vendor/ffmpeg/
 * so they are served at a stable same-origin URL without Vite hashing them.
 * This runs on both `vite dev` and `vite build`.
 */
function copyFFmpegCore(): Plugin {
  return {
    name: 'copy-ffmpeg-core',
    buildStart() {
      const srcDir = join('node_modules', '@ffmpeg', 'core-st', 'dist');
      const destDir = join('public', 'vendor', 'ffmpeg');

      mkdirSync(destDir, { recursive: true });

      for (const file of ['ffmpeg-core.js', 'ffmpeg-core.wasm', 'ffmpeg-core.worker.js']) {
        copyFileSync(join(srcDir, file), join(destDir, file));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyFFmpegCore()],
  server: {
    allowedHosts: true,
  },
  optimizeDeps: {
    // @ffmpeg/ffmpeg uses import.meta.url and dynamic patterns that Vite's
    // pre-bundler breaks; serve it as-is so the browser loads it directly.
    exclude: ['@ffmpeg/ffmpeg'],
  },
  build: {
    outDir: 'dist/app',
    target: 'esnext',
  },
});
