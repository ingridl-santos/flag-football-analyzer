import { InitOptions } from 'i18next';

/**
 * This options used in i18n.ts and .storybook
 * For all options read: https://www.i18next.com/overview/configuration-options
 */
export const initOptions: InitOptions = {
  debug: false,
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  defaultNS: 'common',
  fallbackLng: 'en-US',
  supportedLngs: ['en-US', 'pt-BR'],
  interpolation: {
    // Not needed for react as it escapes by default
    escapeValue: false,
  },
  ns: [
    'common',
  ],
};
