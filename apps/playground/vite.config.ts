import path from 'node:path';
import tailwind from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative asset URLs so the built bundle works when loaded via file://
  // inside Electron (where absolute "/" resolves to the filesystem root).
  base: './',
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwind(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@oh/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@oh/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
      '@oh/motion': path.resolve(__dirname, '../../packages/motion/src'),
      '@oh/icons': path.resolve(__dirname, '../../packages/icons/src'),
      '@oh/brand': path.resolve(__dirname, '../../packages/brand/src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'chrome120',
  },
});
