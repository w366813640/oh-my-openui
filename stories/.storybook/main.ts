import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const repoRoot = path.resolve(__dirname, '../..');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen',
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> | undefined),
      '@oh/ui': path.resolve(repoRoot, 'packages/ui/src'),
      '@oh/tokens': path.resolve(repoRoot, 'packages/tokens/src'),
      '@oh/motion': path.resolve(repoRoot, 'packages/motion/src'),
      '@oh/icons': path.resolve(repoRoot, 'packages/icons/src'),
      '@oh/brand': path.resolve(repoRoot, 'packages/brand/src'),
    };

    const { default: tailwind } = await import('@tailwindcss/vite');
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwind()];

    return viteConfig;
  },
};

export default config;
