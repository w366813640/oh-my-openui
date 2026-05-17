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
    // Shiki language grammars genuinely cross 500 kB (especially `cpp`); the
    // warning is noise as long as we keep them dynamic + isolated.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Hand-pick a few vendor chunks so the main bundle stays interactive
        // quickly. Shiki / markdown stay in their own splits because they're
        // already lazy-imported via `import()`; Rollup fingerprints them per-language.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // React core stays in the main entry — splitting it just adds a waterfall.
          if (id.includes('/node_modules/motion/') || id.includes('\\node_modules\\motion\\'))
            return 'vendor-motion';
          if (id.includes('@radix-ui')) return 'vendor-radix';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('@tanstack')) return 'vendor-router';
          if (
            id.includes('react-markdown') ||
            id.includes('remark-gfm') ||
            id.includes('mdast-util') ||
            id.includes('micromark') ||
            id.includes('hast-util') ||
            id.includes('unist-util')
          )
            return 'vendor-markdown';
          return undefined;
        },
      },
    },
  },
});
