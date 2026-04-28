import { BrandProvider, auroraBrand } from '@oh/brand';
import {
  I18nProvider,
  ModalStackProvider,
  ThemeProvider,
  ToastProvider,
  TooltipProvider,
} from '@oh/ui';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Decorator, Preview } from '@storybook/react';
import '../src/preview.css';

const withProviders: Decorator = (Story) => (
  <ThemeProvider>
    <I18nProvider>
      <BrandProvider brand={auroraBrand}>
        <TooltipProvider delayDuration={150}>
          <ToastProvider>
            <ModalStackProvider>
              <div className="bg-[var(--color-bg)] text-[var(--color-text)] font-sans p-6 min-h-screen">
                <Story />
              </div>
            </ModalStackProvider>
          </ToastProvider>
        </TooltipProvider>
      </BrandProvider>
    </I18nProvider>
  </ThemeProvider>
);

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    withProviders,
  ],
};

export default preview;
