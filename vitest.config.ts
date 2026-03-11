import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react() as any],
        test: {
          name: 'unit',
          globals: true,
          environment: 'happy-dom',
          include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
          exclude: ['src/**/*.stories.{js,jsx,ts,tsx}'],
          setupFiles: [
            'src/config/setupTests.ts',
            'src/config/setupPortableStories.ts',
          ],
          testTimeout: 10000,
          server: {
            deps: {
              inline: ['@mui/material'],
            },
          },
        },
      },
    ],
  },
});