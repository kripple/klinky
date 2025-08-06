import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = 'netlify/edge-functions' as const;
const entry = 'src/backend/api.ts' as const;
const fileName = 'handler' as const;

export default defineConfig({
  build: {
    // Aim for 100 KB to 500 KB (or less).
    chunkSizeWarningLimit: 500,
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, entry),
      fileName,
      formats: ['es'],
      name: fileName,
    },
    outDir,
    ssr: false,
    target: 'esnext',
  },
  clearScreen: false,
  esbuild: {
    loader: 'ts',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
