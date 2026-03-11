import type { Preview } from '@storybook/react-vite';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { theme } from '../src/theme/base';
import i18n from './i18n';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    i18n,
    locale: 'en',
    locales: {
      en: 'English',
      pt: 'Portuguese',
    },
  },
  decorators: [
    (Story) => (
      <>
        <CssBaseline />

        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <MemoryRouter>
              <Routes>
                <Route path='/*' element={<Story />} />
              </Routes>
            </MemoryRouter>
          </I18nextProvider>
        </ThemeProvider>
      </>
    )
  ]
};

export default preview;
